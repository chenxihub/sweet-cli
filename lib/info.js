const inquirer = require("inquirer");
const jsonfile = require("jsonfile");
const path = require("path");
const util = require("./util");
const config = require("./config");

module.exports = {
  //获取模板列表
  getTemplates(callback) {
    util.get(config.organization_repositories_url, function (err, result) {
      if (err) {
        util.showErrorText(err);
        return;
      }
      const info = JSON.parse(result);
      const temps = [];
      info.forEach(function (p) {
        temps.push({
          name: p.name,
          description: p.description,
          tagsUrl: p.tags_url,
        });
      });
      callback(temps);
    });
  },
  //设置模板选项
  showTemplateList(templates, callback) {
    const list = [];
    templates.forEach(function (template) {
      list.push(template.name);
    });
    inquirer.prompt([{
      type: "list",
      name: "template",
      message: "💻 Which template do you want?",
      choices: list,
    }])
      .then(answers => {
        callback(answers.template);
      });
  },
  //获取标签列表
  getTags(url, callback) {
    util.get(url, function (err, result) {
      if (err) {
        util.showErrorText(err);
        return;
      }
      const info = JSON.parse(result);
      const tags = [];
      info.forEach(function (p) {
        tags.push({
          name: p.name,
          zipUrl: p.zipball_url,
        });
      });
      callback(tags);
    });
  },
  //设置标签选项
  showTagList(tags, callback) {
    const list = [];
    tags.forEach(function (tag) {
      list.push(tag.name);
    });
    inquirer.prompt([{
      type: "list",
      name: "tag",
      message: "🏷 Which tag do you want?",
      choices: list,
    }])
      .then(answers => {
        callback(answers.tag);
      });
  },
  //设置项目信息输入
  showProjectInputView(projectName, callback) {
    const projectInput = {
      type: "input",
      name: "project_name",
      message: "Project name",
    };
    if (projectName) {
      projectInput.default = function () {
        return projectName;
      };
    }
    const questions = [
      projectInput,
      {
        type: "input",
        name: "project_description",
        message: "Project description",
        default: function () {
          return "A Sweet Project";
        },
      },
      {
        type: "input",
        name: "author",
        message: "Author",
        default: function () {
          return "      __                                    \n" +
            "     /\\ \\                             __    \n" +
            "  ___\\ \\ \\___      __    ___    __  _/\\_\\   \n" +
            " /'___\\ \\  _ `\\  /'__`\\/' _ `\\ /\\ \\/'\\/\\ \\  \n" +
            "/\\ \\__/\\ \\ \\ \\ \\/\\  __//\\ \\/\\ \\\\/>  </\\ \\ \\ \n" +
            "\\ \\____\\\\ \\_\\ \\_\\ \\____\\ \\_\\ \\_\\/\\_/\\_\\\\ \\_\\\n" +
            " \\/____/ \\/_/\\/_/\\/____/\\/_/\\/_/\\//\\/_/ \\/_/\n" +
            "                                            \n" +
            "                                            ";
        },
      },
    ];
    inquirer.prompt(questions).then(answers => {
      callback(answers);
    });
  },
  //下载zipball_url内容
  downloadZipball(zipball_url, projectName, callback) {
    util.downloadAndUnzip(zipball_url, projectName, callback);
  },
  //修改项目的信息
  editProjectInfo(project) {
    const jsonPath = path.join(project.project_name, "package.json");
    try {
      const j = jsonfile.readFileSync(jsonPath);
      j.name = project.project_name;
      j.description = project.project_description;
      j.author = project.author;
      jsonfile.writeFileSync(jsonPath, j, {spaces: 2});
      util.showInfoText("📦 All done!");
    } catch (e) {
      util.showErrorText(e);
    }
  },
};
