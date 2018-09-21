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
    b-row
      b-btn(variant="link" @click="$refs.modal.show()") Change Data
    div(class="text-left")
      b-json-renderer(root :data-object=`internal.data && internal.data || {}`)
</template>

<script>
import data from "../assets/data.json";

export default {
  name: "index",
  data() {
    return {
      internal: {
        setData: {
          fromFile: false,
        },
        data: {
          data: data
        }
      },
      input: {
        data: "",
        jsonFile: null,

      }
    };
  },
  mounted() {
    console.log(data);
  },
  methods: {
    setData() {
      if(this.internal.setData.fromFile) {
        let jsonFile = this.input.jsonFile;
        if(jsonFile) {
          var reader = new FileReader();
          reader.onloadend = event => {
            this.internal.data.data = JSON.parse(reader.result);
          };
          reader.readAsText(jsonFile);
          reader.onerror = event => {
            console.error(event);
          }
        }
      }
      else this.internal.data.data = JSON.parse(this.input.data);
    }
  }
};
</script>

