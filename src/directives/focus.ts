import type {DirectiveBinding} from "vue";

export const focus = {
    mounted: (el: HTMLElement, binding: DirectiveBinding) => {
        const {value = true} = binding;
        if (value) {
            setTimeout(() => el.focus());
        }
    }
};