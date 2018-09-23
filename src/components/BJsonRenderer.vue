<template lang="pug">
  b-container(v-if="editable" class="w-100")
    b-btn(
      v-if="root"
      variant="success"
      @click="save"
    ) Save
    b-input(
      v-if="dataObject.data === {} || dataObject.data === null || type === 'number' || type === 'string'" 
      @change="evt => changeData($el, evt)"
      :placeholder="type"
      :value="dataObject.data"
    )
    div(v-else-if="type === 'boolean'" )
      b-btn(
        variant="link"
        @click="toggleData"
      )
        fa-icon(
          :icon="dataObject.data === false ? 'square' : 'check-square'"
        )
      span(class="mx-2" v-text="dataObject.data")
    b-card(
      v-else-if="type == 'object'" 
      class="w-100"
    )
      b-row(v-if="root")
        b-input-group(class="my-2")
          vue-bootstrap-typeahead(
            v-if="!Array.isArray(dataObject.data) && typeof dataObject.data == 'object'" 
            v-model="input.filter[0]"
            :data="Object.keys(dataObject.data).map(key => `${key}: ${getText(dataObject.data[key])}`)"
            @hit="input.filter[0] = $event.substring(0, $event.indexOf(':'))"
          )
          b-input-group-text(slot="prepend")
            fa-icon(icon="search")
      div(v-for="(key, index) in Object.keys(dataObject.data)" :key="index")
        div(v-if="testFilter(input.filter[0], key) || testFilter(input.filter[0], dataObject.data[key])")
          b-row
            label(class="border-bottom border-secondary font-weight-bold small mr-3" v-text="`${key}:`")
          b-row
            b-json-renderer(:id="key" editable @input="val => dataObject.data[key] = val" :filter="input.filter[0]" class="ml-5" :data-object="{data: dataObject.data[key]}")
    b-card(v-else-if="type == 'array'" :class="['w-100',root ? 'bg-light border-dark' : 'border']")
      b-btn(
        variant="primary"
        v-if="canAddNewInstance()"
        class="float-right"
        @click="dataObject.data.push('')"
      ) 
        fa-icon(icon="plus-circle")
      b-list-group(
        flush
      )
        b-list-group-item(
          class="p-0"
          v-if="Array.isArray(dataObject.data)"
          v-for="(item, index) in dataObject.data"
          :key="index" 
        )
          div(v-if="root")
            div(class="bg-light")
              b-row(align-h="center")
                //- span(v-text="JSON.stringify(input, null, 4)")
                b-btn(
                  variant="secondary" 
                  @click="toggleObj(index)"
                )
                  fa-icon(:icon="input.showing[index] ? 'plus-circle' : 'minus-circle'")
              b-row
                h2(v-text="`Item ${index + 1}`" class="text-center w-100")
            b-collapse(v-model="!input.showing[index]" id="collapse")
              b-row(class="py-1 my-3 border-top border-bottom")
                b-input-group(class="my-2")
                  vue-bootstrap-typeahead(
                    v-if="!Array.isArray(item) && typeof item == 'object'" 
                    v-model="input.filter[index]"
                    :data="Object.keys(item).map(key => `${key}: ${getText(item[key])}`)"
                    @hit="input.filter[index] = $event.substring(0, $event.indexOf(':'))"
                  )
                  b-input-group-text(slot="prepend")
                    fa-icon(icon="search")
              b-json-renderer(
                :filter="input.filter[index]"
                :data-object="{data: item}"
                editable
                @input="val => item = val"
              )
              hr(v-if="root" class="bg-secondary p-1")
          b-json-renderer(
              v-else
              :filter="input.filter[index]"
              :data-object="{data: item}"
              editable
              @input="val => item = val"
            )
  div(v-else)
    //- p(v-text="type")
    span(
      v-if="['string','number'].indexOf(type) >= 0" 
      :class="getClass(dataObject)" 
      v-text="dataObject.data"
    )
    div(v-else-if="type == 'boolean'" )
      fa-icon(
        
        :icon="dataObject.data === false ? 'square' : 'check-square'"
      )
      span(class="mx-2" v-text="dataObject.data")
    b-card(
      v-else-if="type == 'object'" 
    )
      b-row(v-if="root")
        b-input-group(class="my-2")
          vue-bootstrap-typeahead(
            v-if="!Array.isArray(dataObject.data) && typeof dataObject.data == 'object'" 
            v-model="input.filter[0]"
            :data="Object.keys(dataObject.data).map(key => `${key}: ${getText(dataObject.data[key])}`)"
            @hit="input.filter[0] = $event.substring(0, $event.indexOf(':'))"
          )
          b-input-group-text(slot="prepend")
            fa-icon(icon="search")
      div(v-for="(key, index) in Object.keys(dataObject.data)" :key="index")
        div(v-if="testFilter(input.filter[0], key) || testFilter(input.filter[0], dataObject.data[key])")
          b-row
            label(class="border-bottom border-secondary font-weight-bold small mr-3" v-text="`${key}:`")
          b-row
            b-json-renderer(:id="key" :filter="input.filter[0]" class="ml-5" :data-object="{data: dataObject.data[key]}")
    b-card(v-else-if="type == 'array'" :class="root ? 'bg-light border-dark' : 'border'")
      b-list-group(
        flush
      )
        b-list-group-item(
          class="p-0"
          v-if="Array.isArray(dataObject.data)"
          v-for="(item, index) in dataObject.data"
          :key="index" 
        )
          div(v-if="root")
            div(class="bg-light")
              b-row(align-h="center")
                //- span(v-text="JSON.stringify(input, null, 4)")
                b-btn(
                  variant="secondary" 
                  @click="toggleObj(index)"
                )
                  fa-icon(:icon="input.showing[index] ? 'plus-circle' : 'minus-circle'")
              b-row
                h2(v-text="`Item ${index + 1}`" class="text-center w-100")
            b-collapse(v-model="!input.showing[index]" id="collapse")
              b-row(class="py-1 my-3 border-top border-bottom")
                b-input-group(class="my-2")
                  vue-bootstrap-typeahead(
                    v-if="!Array.isArray(item) && typeof item == 'object'" 
                    v-model="input.filter[index]"
                    :data="Object.keys(item).map(key => `${key}: ${getText(item[key])}`)"
                    @hit="input.filter[index] = $event.substring(0, $event.indexOf(':'))"
                  )
                  b-input-group-text(slot="prepend")
                    fa-icon(icon="search")
              b-json-renderer(
                :filter="input.filter[index]"
                :data-object="{data: item}"
              )
              hr(v-if="root" class="bg-secondary p-1")
          b-json-renderer(
              v-else
              :filter="input.filter[index]"
              :data-object="{data: item}"
            )





</template>


<script>
import { find } from "../deep-search.js";
import download from 'downloadjs';

export default {
  name: "b-json-renderer",
  mounted() {
    this.render();
  },
  props: {
    dataObject: {
      type: Object,
      required: true
    },
    root: {
      type: Boolean,

      default: false
    },
    groupName: "",
    filter: String,
    editable: {
      type: Boolean,
      default: false
    },
    property: Object|String|Number|Boolean
  },

  data() {
    return {
      type: null,
      originalVal: '',
      input: {
        filter: [],
        showing: []
      },
      view: {
        data: {}
      }
    };
  },
  methods: {
    toggleObj(index) {
      this.input.showing[index] = !this.input.showing[index];
      this.$forceUpdate();
    },
    getText(data) {
      if (typeof data == "object") {
        let retVal = JSON.stringify(data);
        let removeChar = char => (retVal = retVal.split(char).join(""));
        let replaceChar = (char1, char2) =>
          (retVal = retVal.split(char1).join(char2));
        ["[", "]", '"'].forEach(removeChar);
        replaceChar(":", ": ");
        replaceChar(",", ", ");
        replaceChar("{", "(");
        replaceChar("}", ")");
        return retVal;
      } else return data;
    },
    testFilter(filter, data) {
      return !filter || find(data, filter).length > 0;
    },
    getClass(dataObject) {
      return this.originalVal != this.dataObject.data ? 'edited' : '';
    },
    save(evt) {
      download(JSON.stringify(this.dataObject.data, null, 4), 'data-object.json', 'application/json');
    },
    toggleData() {
      this.dataObject.data = !this.dataObject.data;
      console.log(this.dataObject);
      this.$forceUpdate();
    },
    changeData(obj, evt) {
      obj.className = obj.className.replace('edited','');
      obj.className = this.originalVal != this.dataObject.data ? `${obj.className} ${this.getClass()}` : obj.className;
      console.log(evt);
      this.$emit('input', evt);
      
    },
    render() {
      let nothing = () => {};

      let data = this.dataObject.data;
      this.type = this.getType(data);
      this.$forceUpdate();
      this.originalVal = data;
      // console.log("Type:", this.type);
    },
    getType(data) {
      let retVal = "";
      if (data == null || data == undefined) return "";
      switch (typeof data) {
        case "object":
          Array.isArray(data)
            ? (retVal = "array")
            : data !== null && data !== undefined
              ? (retVal = "object")
              : () => nothing();
          break;
        case "number":
          retVal = "number";
          break;
        case "string":
          retVal = "string";
          break;
        case "boolean":
          retVal = "boolean";
          break;
      }

      return retVal;
    },
    canAddNewInstance() {
      return true;
    }
  },
  watch: {
    type: function(newV, oldV) {
      this.type = newV;
      this.$forceUpdate();
    },
    dataObject: function(newV, oldV) {
      this.render();
    }
  }
};
</script>


<style>
.edited {
  background-color: rgb(240, 248, 167) !important;
}
</style>
