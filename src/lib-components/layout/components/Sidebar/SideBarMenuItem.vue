<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];
    // console.log("icon nhidv");
    // console.log(icon);
    // console.log(title);
    // console.log(context);
    if (icon) {
      if (icon.includes("el-icon")) {
        // vnodes.push(<i class={[icon, "sub-el-icon"]} />);
        vnodes.push(h("i", { class: [icon, "sub-el-icon"] }));
      } else {
        // vnodes.push(<svg-icon icon-class={icon} />);
        // vnodes.push(h("svg-icon", { "icon-class": icon }));

        // const txt = '<use xlink:href="#icon-' + icon + '"></use>';
        // let elem = h("svg", {
        //   class: "svg-icon",
        //   attrs: {
        //     aria-hidden: true,
        //   },
        //   domProps: {
        //     innerHTML: txt,
        //   },
        // });
        // vnodes.push(elem);

        vnodes.push(
          h("svg-icon", {
            attrs: {
              "icon-class": icon,
            },
          })
        );
      }
    }

    if (title) {
      // vnodes.push(<span slot="title">{title}</span>);
      vnodes.push(h("span", { slot: "title" }, title));
    }

    // console.log(vnodes);
    // console.log(h);
    return vnodes;
  },
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
