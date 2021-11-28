<template>
  <div class="editor-container">
    <div class="editor-box">
      <textarea id="textArea" cols="30" rows="10"></textarea>
    </div>
    <div id="markdown"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from "vue";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import "codemirror/mode/go/go.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/javascript/javascript.js";

import { unified } from "unified";
// markdown to syntax tree
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const _M_ = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

export default defineComponent({
  setup() {
    let ph: number = document.documentElement.clientHeight;
    let pw: number = document.documentElement.clientWidth;
    let ch = "auto";

    onMounted(() => {
      const markdown = document.getElementById("markdown");
      //       .process("# Hi\n\n*Hello*, world!")
      // .then((file) => {
      //   markdown!.innerHTML = String(file);
      // });

      nextTick(() => {
        var editor = CodeMirror.fromTextArea(
          document.getElementById("textArea"),
          {
            line: true,
            lineNumbers: true,
            tabSize: 4,
            mode: "markdown",
            theme: "idea",
            lineWrapping: true,
          }
        );

        editor.on("change", (instance: any, changeObj: any) => {
          const text = instance.getValue();
          console.log(text);
          _M_.process(text).then((file) => {
            console.log(file);
            markdown!.innerHTML = String(file);
          });
        });

        editor.on("inputRead", (instance: any, changeObj: any) => {
          const text = changeObj.text.join("");
          switch (text) {
            case "{":
              instance.replaceSelection("}");
              break;
            case "[":
              instance.replaceSelection("]");
              break;
          }
        });

        editor.setOption("extraKeys", {});
      });
    });
  },
});
</script>

<style lang="scss">
.editor-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}

.content {
  height: 100px;
}

.CodeMirror {
  display: inline-block;
  font-size: 15px;
  width: 50%;
  height: inherit;
}

.editor-box {
  width: 50%;
  height: 100%;
}

#markdown {
  width: 50%;
  display: inline-block;
  // background-color: papayawhip;
}
</style>
