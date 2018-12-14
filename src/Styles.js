// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

export function HeaderStyle(context) {
  return {
    fontSize: "2em",
    zIndex:  context.props.Visible? 4 : -4,
    opacity: context.props.Visible? 1 :  0
  };
}
export function ThumbnailStyle(context) {
  if( context.props.ParentType === "Section" ) return {
    // Section
    maxHeight: "100%",
    width: "auto"
  };
  if( context.props.ParentType === "VideoBox" ) return {
    // VideoBox
    maxWidth: "10%",
    maxHeight: "10%",
    transform: "scale(10)",
    marginBottom: "-80%"
    // seriously, wtf CSS, what's the deal??
    // the plan was to scale the image tenfold, then set it to be at most 10%
    // of the size of it's parent container (100% after scaling). This puts the
    // image in the wrong place, so apparently setting marginBottom to -80%
    // fixes that? ¯\_(ツ)_/¯
  };
  throw new Error(
    "Context not set up yet for style for thumbnail for " +
    JSON.stringify(context)
  );
}
export function SectionStyle() {
  return {
    display: "inline-block",
    width: "86%",
    paddingLeft: "7%",
  };
}
export function SectionHeadStyle(context) {
  return {
    fontSize: "1.5em",
    textAlign: "left",
    paddingLeft: "15%",
    paddingTop: context.headerPadding,
    paddingBottom: context.headerPadding,
  };
}

export function VideoWrapperStyle() {
  return {
    position: 'absolute',
    zIndex: "5",
    top: "auto",
    left: 0,
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%"
  };
}

export function PlayerStyle(){
  return {
    textAlign: 'left'
  };
}

export function PlayerLoadingStyle(context) {
  if( context.state === null ) return { zIndex: 10, opacity: 1 };
  return context.state.loaded? {
    zIndex: -10, opacity: 0, transition: "all .3s"
  } : {
    zIndex: 10, opacity: 1
  };
}
