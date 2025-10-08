import MarkButton from "../MarkButton";
import BlockButton from "../BlockButton";
import React from "react";

function Toolbar() {
    return (
        <div style={{marginBottom: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
            <MarkButton format="bold" icon="B"/>
            <MarkButton format="italic" icon="I"/>
            <MarkButton format="underline" icon="U"/>
            <MarkButton format="code" icon="<>"/>
            <BlockButton format="heading-one" icon="H1"/>
            <BlockButton format="heading-two" icon="H2"/>
            <BlockButton format="block-quote" icon='"""'/>
            <BlockButton format="numbered-list" icon="1."/>
            <BlockButton format="bulleted-list" icon="•"/>
            <BlockButton format="left" icon="⇤"/>
            <BlockButton format="center" icon="↔"/>
            <BlockButton format="right" icon="⇥"/>
        </div>
    )
}

export default Toolbar;