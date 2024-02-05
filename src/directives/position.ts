import type {DirectiveBinding} from "vue";

const findOverflowHiddenParent = (el: HTMLElement): HTMLElement => {
    let parent = el.parentElement;
 
    while (parent) {
        const style = window.getComputedStyle(parent);

        if (style.overflow === "hidden") {
            return parent;
        }

        // check if parent is body
        if (parent === document.body) {
            return parent;
        }

        parent = parent.parentElement;
    }

    return document.body;
};

const findAbsoluteOrRelativeParent = (el: HTMLElement): HTMLElement => {
    let parent = el.parentElement;

    while (parent) {
        const style = window.getComputedStyle(parent);

        if (style.position === "absolute" || style.position === "relative") {
            return parent;
        }

        // check if parent is body
        if (parent === document.body) {
            return parent;
        }

        parent = parent.parentElement;
    }

    return document.body;
};

export const position = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const {value} = binding;

        if (value === false) {
            return;
        }

        const anchorParent = findAbsoluteOrRelativeParent(el);
        const overflowParent = findOverflowHiddenParent(el);

        const {width: overflowParentWidth, height: overflowParentHeight, top: overflowParentTop, left: overflowParentLeft} = overflowParent.getBoundingClientRect();
        const {top: anchorParentTop, left: anchorParentLeft} = anchorParent.getBoundingClientRect();

        const elementTop = anchorParentTop - overflowParentTop;
        const elementLeft = anchorParentLeft - overflowParentLeft;

        // check if element can be visible on the bottom of the screen
        const { height, width} = el.getBoundingClientRect();
        const bottom = elementTop + height;
        const right = elementLeft + width;

        console.log(bottom, overflowParentHeight);

        if (bottom > overflowParentHeight) {
            el.style.top = `-${height}px`;
        } else {
            const {height: anchorParentHeight} = anchorParent.getBoundingClientRect();
            el.style.top = `${anchorParentHeight}px`;
        }

        if (right > overflowParentWidth) {
            el.style.right = "0px";
        } else {
            el.style.left = "0px";
        }
    }
};