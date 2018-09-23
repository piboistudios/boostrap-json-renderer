<template lang="pug">
  b-container(fluid id="index")
    h2 JSON Data Renderer
    b-modal(
      ref="modal"
      header-bg-variant="primary"
      footer-bg-variant="secondary"
      @ok="setData"
      ok-variant="success"
    )
      template(slot="modal-ok")
        span Update Data
      b-form-checkbox(v-model="internal.setData.fromFile") From File?
      div(v-if="internal.setData.fromFile")
        b-form-file(
          v-model="input.jsonFile"
        )
      div(v-else)
        b-form-textarea(
          :rows="6"
          :max-rows="10"
          v-model="input.data"
        )
    b-row(align-h="center")
      b-btn(variant="primary" size="lg" @click="$refs.modal.show()") Change Data
    
    b-form-group(
      label="Editable"
      label-for="editable-input"
      id="editable-fieldset"
      description="Edit form?"
    )
        b-form-checkbox(
          id="editable-input"
          v-model="input.editable"
        )
    b-card(class="text-left bg-light" no-body )
      b-json-renderer(:editable="input.editable" root :data-object=`internal.data && internal.data || {}`)
</template>

<script>
import data from "../assets/data.json";
window.onkeypress = function(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case "s":
        event.preventDefault();
        alert("ctrl-s");
        break;
      case "f":
        event.preventDefault();
        alert("ctrl-f");
        break;
      case "g":
        event.preventDefault();
        alert("ctrl-g");
        break;
    }
  }
};

let dataEl = document.querySelector("#dataset");
let preData = null;
if (dataEl) {
  preData = JSON.parse(dataEl.innerHTML);
}
export default {
  name: "index",
  data() {
    return {
      internal: {
        dataChanged: false,
        setData: {
          fromFile: true
        },
        data: {
          data: data
        }
      },
      input: {
        data: "",
        jsonFile: null,
        editable: true
      }
    };
  },
  mounted() {
    if (preData != null) this.internal.data.data = preData;
  },
  methods: {
    setData() {
      this.internal.dataChanged = true;
      this.$forceUpdate();
      if (this.internal.setData.fromFile) {
        let jsonFile = this.input.jsonFile;
        if (jsonFile) {
          var reader = new FileReader();
          reader.onloadend = event => {
            this.internal.data.data = JSON.parse(reader.result);
          };
          reader.readAsText(jsonFile);
          reader.onerror = event => {
            console.error(event);
          };
        }
      } else this.internal.data.data = JSON.parse(this.input.data);
    }
  }
};
</script>

