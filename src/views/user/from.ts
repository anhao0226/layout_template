
import { hasOwn, isArray } from "@/utils";
import { defineComponent, h, ref, VNode } from "vue";
import { ElButton, ElSelect, ElOption, ElInput, ElDatePicker, ElForm, ElFormItem } from "element-plus"
import i18n from "@/plugins/i18n"

const defaultStyle = {
    width: "100%"
}

const name = ref({ email: "", gender: "", city: "" })

const components: Record<string, VNode> = {
    "date": h(ElDatePicker, { style: defaultStyle }),
    "select": h(ElSelect, { style: defaultStyle }),
    "input": h(ElInput),
}

const createSelectComponent = (ops: string[]): VNode => {
    const comps: VNode[] = [];
    // ops.forEach(item => comps.push(h(ElOption, item)))
    return h(ElSelect, { style: defaultStyle }, comps)
}

const createFormItem = (label: string, node: VNode): VNode => {
    return h(ElFormItem, { label: i18n.global.t(label) }, {
        default: () => { return node }
    });
}

const createInputComponent = (placeholder: string, obj: any, prop: string) => {
    return h(ElInput, {
        placeholder, modelValue: (name.value as any)[prop],
        'onUpdate:modelValue': value => { (name.value as any)[prop] = value }
    })
}

const buildVNode = (type: string, label: string) => {
    ///
}




export default defineComponent({
    props: ["header", "default"],
    render() {
        const items: VNode[] = [];
        if (hasOwn(this.$props, "header") && isArray(this.$props.header)) {
            const value = ref({});
            this.$props.header.forEach((item: { $type: string, label: string, $ops: string[], prop: string }) => {
                if (hasOwn(item, "prop")) {
                    (value.value as any)[item.prop] = ""
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



