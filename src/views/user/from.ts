
import { hasOwn, isArray } from "@/utils";
import { Component, defineComponent, h, ref, VNode } from "vue";
import { ElButton, ElSelect, ElOption, ElInput, ElDatePicker, ElForm, ElFormItem } from "element-plus"
import i18n from "@/plugins/i18n"

const defaultStyle = {
    width: "100%"
}

let value: any = null;

const components: Record<string, VNode> = {
    "date": h(ElDatePicker, { style: defaultStyle }),
    "select": h(ElSelect, { style: defaultStyle }),
    "input": h(ElInput),
}

const createSelectComponent = (ops: string[]): VNode => {
    const options: VNode[] = [];
    ops.forEach(item => options.push(h(ElOption, null, { label: "" })))
    return h(ElSelect, { style: defaultStyle }, {
        defaul: () => options
    })
}

const createFormItem = (label: string, node: VNode): VNode => {
    return h(ElFormItem, { label: i18n.global.t(label) }, {
        default: () => { return node }
    });
}

const createInputComponent = (placeholder: string, obj: any, prop: string) => {
    return h(ElInput, {
        placeholder, modelValue: (value.value as any)[prop],
        'onUpdate:modelValue': v => { (value.value as any)[prop] = v }
    })
}

const buildVNode = (type: string, label: string) => {
    ///
}


export function buildCityComponent() {
    return defineComponent({
        props: ["modelValue", "options"],
        emits: ["update:modelValue"],
    })
}


export function buildSelectComponent(ops?: { label: string, value: number }[]): Component {
    return defineComponent({
        props: ["modelValue", "options"],
        emits: ["update:modelValue"],
        render() {
            return h(
                ElSelect,
                {
                    modelValue: this.modelValue,
                    onChange: (value) => {
                        this.$emit("update:modelValue", value)
                    },
                    style: {
                        width: "100%"
                    }
                },
                {
                    default: () => {
                        const options: VNode[] = [];
                        const _ops = [...(ops || []), ...(this.$props.options || [])]
                        _ops.forEach(({ label, value }) => options.push(h(ElOption, { label, value })))
                        return options;
                    },
                }
            );
        }
    })
}



export const t = defineComponent({
    data() {
        return {

        }
    },
    props: ["header", "value"],
    render() {
        value = ref(Object.assign({}, this.$props.value));
        const items: VNode[] = [];
        if (hasOwn(this.$props, "header") && isArray(this.$props.header)) {
            this.$props.header.forEach((item: { $type: string, label: string, $ops: string[], prop: string }) => {
                if (hasOwn(item, "prop")) {
                    switch (item.$type) {
                        // case "date":
                        //     items.push(createFormItem(item.label, components[item.$type]));
                        //     break;
                        // case "select":
                        //     items.push(createFormItem(item.label, createSelectComponent(item.$ops || [])));
                        //     break;
                        default:
                            items.push(createFormItem(item.label, createInputComponent("121212", value, item.prop)));
                    }
                }
            });

            console.log(value);
        }
        return h(ElForm, { labelPosition: "top" }, {
            default: () => {
                return items
            }
        });
    }
})



