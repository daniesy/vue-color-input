import type {DirectiveBinding} from "vue";

declare global {
    interface HTMLElement {
        clickOutsideEvent?: (event: MouseEvent) => void;
    }
}

export const clickOutside = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        setTimeout(() => {
            el.clickOutsideEvent = (event: MouseEvent) => {
                if (event.button !== 0) {
                    return;
                }

                const {value} = binding;

                const {x, y, width, height} = el.getBoundingClientRect();

                // check if x and y of click are within the element
                const withinBoundaries = event.clientX >= x
                    && event.clientX <= x + width
                    && event.clientY >= y
                    && event.clientY <= y + height;

                if (withinBoundaries) {
                    return;
                }

                if (typeof value === "function") {
                    value(event);
                }
            };
            window.addEventListener("mouseup", el.clickOutsideEvent);
        }, 100);
    },

    beforeUnmount(el: HTMLElement) {
        if (! el.clickOutsideEvent) {
            return;
        }
        window.removeEventListener("mouseup", el.clickOutsideEvent);
    }
};