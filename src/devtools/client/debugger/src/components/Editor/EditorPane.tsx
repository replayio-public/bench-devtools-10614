import classNames from "classnames";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { setUnexpectedError } from "ui/actions/errors";
import { ReplayUpdatedError } from "ui/components/ErrorBoundary";
import { Redacted } from "ui/components/Redacted";
import { useFeature } from "ui/hooks/settings";
import { getToolboxLayout } from "ui/reducers/layout";
import { useAppDispatch, useAppSelector } from "ui/setup/hooks";
import useWidthObserver from "ui/utils/useWidthObserver";

import { getSelectedSource } from "ui/reducers/sources";
import { waitForEditor } from "../../utils/editor/create-editor";

import WelcomeBox from "../WelcomeBox";

import Editor from "./index";
import EditorTabs from "./Tabs";
import EditorFooter from "./Footer";

export const EditorPane = () => {
  const [loadingEditor, setLoadingEditor] = useState(true);
  const dispatch = useAppDispatch();
  const toolboxLayout = useAppSelector(getToolboxLayout);
  const selectedSource = useAppSelector(getSelectedSource);
  const panelEl = useRef(null);
  const { value: enableLargeText } = useFeature("enableLargeText");

  const nodeWidth = useWidthObserver(panelEl);

  // ExperimentFeature: LargeText Logic
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(":root")!;
    if (enableLargeText) {
      root.style.setProperty("--theme-code-font-size", "14px");
    } else {
      root.style.setProperty("--theme-code-font-size", "11px");
    }
  }, [enableLargeText]);
  useEffect(() => {
    (async () => {
      try {
        await waitForEditor();
        setLoadingEditor(false);
      } catch {
        dispatch(setUnexpectedError(ReplayUpdatedError));
      }
    })();
  }, [dispatch]);

  if (loadingEditor) {
    return null;
  }

  return (
    <div
      className={classNames("editor-pane overflow-hidden ", {
        narrow: nodeWidth && nodeWidth < 240,
        "rounded-lg": toolboxLayout == "ide",
      })}
      ref={panelEl}
    >
      <div className="editor-container relative">
        <EditorTabs />
        {selectedSource ? (
          <Redacted>
            <Editor />
          </Redacted>
        ) : (
          <WelcomeBox />
        )}
        {selectedSource && <EditorFooter />}
      </div>
    </div>
  );
};
