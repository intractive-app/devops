"use strict";

const compareFunc = require(`compare-func`);
const Q = require(`q`);
const readFile = Q.denodeify(require(`fs`).readFile);
const resolve = require(`path`).resolve;


// In reverse order (last one comes first)
const groupOrder = ["Bug Fixes", "Improvements", "Features"];

module.exports = Q.all([
  readFile(resolve(__dirname, `./templates/template.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/header.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/commit.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/footer.hbs`), `utf-8`)
]).spread((template, header, commit, footer) => {
  const writerOpts = getWriterOpts();

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;
  writerOpts.footerPartial = footer;

  return writerOpts;
});

function getWriterOpts() {
  return {
    transform: (commit, context) => {
      let discard = true;
      const issues = [];

      commit.notes.forEach(note => {
        note.title = `BREAKING CHANGES`;
        discard = false;
      });

      if (commit.type === `feat`) {
        commit.type = `Features`;
      } else if (commit.type === `fix`) {
        commit.type = `Bug Fixes`;
      } else if (commit.type === `improvement`) {
        commit.type = `Improvements`;
      } else if (commit.type === `perf`) {
        commit.type = `Performance Improvements`;
      } else if (commit.type === `revert` || commit.revert) {
        commit.type = `Reverts`;
      } else if (discard) {
        return;
      } else if (commit.type === `docs`) {
        commit.type = `Documentation`;
      } else if (commit.type === `style`) {
        commit.type = `Styles`;
      } else if (commit.type === `refactor`) {
        commit.type = `Code Refactoring`;
      } else if (commit.type === `test`) {
        commit.type = `Tests`;
      } else if (commit.type === `build`) {
        commit.type = `Build System`;
      } else if (commit.type === `ci`) {
        commit.type = `Continuous Integration`;
      }

      if (commit.scope === `*`) {
        commit.scope = ``;
      }

      if (typeof commit.hash === `string`) {
        commit.shortHash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === `string`) {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;
        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(
            /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
            (_, username) => {
              if (username.includes("/")) {
                return `@${username}`;
              }

              return `[@${username}](${context.host}/${username})`;
            }
          );
        }
      }

      if (typeof commit.body === `string`) {
        const paragraphs = commit.body.trim().split("\n\n");

        const output = [];
        for(let paragraph of paragraphs) {

          paragraph = paragraph
          .split("\n")
          .map((line) => {

            if(line.indexOf("Co-authored-by:") > -1)
              return null;
            return `  ${line}  `;
          })
          .filter(l => !!l)
          .join("\n");

          if(!/^  [-\*] /.test(paragraph)) 
            paragraph = paragraph.replace(/^  /, "  * ");

          output.push(paragraph);
        }

        commit.body = output.join("\n").trimEnd() + "\n";
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });

      return commit;
    },
    groupBy: `type`,
    commitGroupsSort: (a, b) => {
      const aIndex = groupOrder.indexOf(a.title)
      const bIndex = groupOrder.indexOf(b.title); 

      return aIndex < bIndex ? 1 : -1;
    },
    commitsSort: [`scope`, `subject`],
    noteGroupsSort: `title`,
    notesSort: compareFunc
  };
}
