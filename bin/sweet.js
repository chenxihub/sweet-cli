#!/usr/bin/env node

const yargs = require("yargs");
const info = require("../lib/info");
const args = yargs
  .command({
    command: "create <name>",
    desc: "Create a sweet template.",
    builder: {},
    handler: function (argv) {
      let projectName = argv.name;
      //1.获取模板列表
      info.getTemplates(function (templates) {
        //2.设置选项
        info.showTemplateList(templates, (templateName) => {
          const t = templates.find((template) => {
            return template.name === templateName;
          });
          //3.获取标签列表
          info.getTags(t.tagsUrl, (tags) => {
            //4.设置选项
            info.showTagList(tags, (tagName) => {
              const tag = tags.find((tag) => {
                return tag.name === tagName;
              });
              //5.项目信息输入
              info.showProjectInputView(projectName, (project) => {
                projectName = project.project_name;
                //6.下载zip_ball，并复制到目标位置
                info.downloadZipball(tag.zipUrl, projectName, () => {
                  //7.修改项目的信息
                  info.editProjectInfo(project);
                });
              });
            });
          });
        });
      });
    },
  })
  .version() // Use package.json's version
  .help()
  .alias({
    "h": "help",
    "v": "version",
  })
  .strict(true)
  .demandCommand()
  .argv;
