const {doc, p} = require("prosemirror-model/test/build")
const ist = require("ist")
const {tempEditor} = require("./view")

describe("EditorView.endOfTextblock", () => {
  it("works at the left side of a textblock", () => {
    let view = tempEditor({doc: doc(p("a"), p("<a>bcd"))})
    ist(view.endOfTextblock("left"))
    ist(view.endOfTextblock("backward"))
    ist(!view.endOfTextblock("right"))
    ist(!view.endOfTextblock("forward"))
  })

  it("works at the right side of a textblock", () => {
    let view = tempEditor({doc: doc(p("abc<a>"), p("d"))})
    ist(!view.endOfTextblock("left"))
    ist(!view.endOfTextblock("backward"))
    ist(view.endOfTextblock("right"))
    ist(view.endOfTextblock("forward"))
  })

  it("works in the middle of a textblock", () => {
    let view = tempEditor({doc: doc(p("a<a>b"))})
    ist(!view.endOfTextblock("left"))
    ist(!view.endOfTextblock("backward"))
    ist(!view.endOfTextblock("right"))
    ist(!view.endOfTextblock("forward"))
  })

  it("works at the start of the document", () => {
    let view = tempEditor({doc: doc(p("<a>bcd"))})
    ist(view.endOfTextblock("left"))
    ist(view.endOfTextblock("backward"))
    ist(!view.endOfTextblock("right"))
    ist(!view.endOfTextblock("forward"))
  })

  it("works at the end of the document", () => {
    let view = tempEditor({doc: doc(p("abc<a>"))})
    ist(!view.endOfTextblock("left"))
    ist(!view.endOfTextblock("backward"))
    ist(view.endOfTextblock("right"))
    ist(view.endOfTextblock("forward"))
  })

  it("works for vertical motion in a one-line block", () => {
    let view = tempEditor({doc: doc(p("abc<a>"))})
    ist(view.endOfTextblock("up"))
    ist(view.endOfTextblock("down"))
  })

  it("works for vertical motion at the end of a wrapped block", () => {
    let view = tempEditor({doc: doc(p(new Array(100).join("foo ") + "<a>foo"))})
    ist(!view.endOfTextblock("up"))
    ist(view.endOfTextblock("down"))
  })

  it("works for vertical motion at the start of a wrapped block", () => {
    let view = tempEditor({doc: doc(p("foo <a>" + new Array(100).join("foo ")))})
    ist(view.endOfTextblock("up"))
    ist(!view.endOfTextblock("down"))
  })

  // Bidi functionality only works when the browser has Selection.modify
  if (!getSelection().modify) return

  it("works at the start of an RTL block", () => {
    let view = tempEditor({doc: doc(p("<a>مرآة"))})
    view.dom.style.direction = "rtl"
    ist(!view.endOfTextblock("left"))
    ist(view.endOfTextblock("backward"))
    ist(view.endOfTextblock("right"))
    ist(!view.endOfTextblock("forward"))
  })

  it("works at the end of an RTL block", () => {
    let view = tempEditor({doc: doc(p("مرآة<a>"))})
    view.dom.style.direction = "rtl"
    ist(view.endOfTextblock("left"))
    ist(!view.endOfTextblock("backward"))
    ist(!view.endOfTextblock("right"))
    ist(view.endOfTextblock("forward"))
  })

  it("works inside an RTL block", () => {
    let view = tempEditor({doc: doc(p("مر<a>آة"))})
    view.dom.style.direction = "rtl"
    ist(!view.endOfTextblock("left"))
    ist(!view.endOfTextblock("backward"))
    ist(!view.endOfTextblock("right"))
    ist(!view.endOfTextblock("forward"))
  })

  it("works in a bidirectional block", () => {
    let view = tempEditor({doc: doc(p("proseمرآة<a>"))})
    ist(!view.endOfTextblock("left"))
    ist(!view.endOfTextblock("backward"))
    ist(view.endOfTextblock("right"))
    ist(view.endOfTextblock("forward"))
  })
})
