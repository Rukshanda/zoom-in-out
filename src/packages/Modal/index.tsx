import styled from "@emotion/styled";
import { useSize } from "hooks/useSize";
import {
  CSSProperties,
  FC,
  MouseEvent as MouseEventReact,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { sleep } from "utils";

type ModalProps = {
  removeDomWhenClose?: boolean;
  isOpen?: boolean;
  children?: ReactNode;
  width?: number | string;
  onClose?: (event: MouseEventReact<HTMLDivElement>) => void;
  style?: CSSProperties;
};

export const Modal: FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  width,
  style,
}) => {
  const { width: widthWindow } = useSize();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const refOpen = useRef(open);
  const refMouse = useRef({ x: 0, y: 0, height: 0 });
  const refModal = useRef<HTMLDivElement | null>(null);
  const refBackdrop = useRef<HTMLDivElement | null>(null);

  const showModal = useCallback(async () => {
    if (!refModal.current || !refBackdrop.current) return;
    refBackdrop.current.removeClass("modal-hidden");
    await sleep(50);
    refBackdrop.current.addClass("modal-show");
    refModal.current.addClass("modal-begin-show");
    const rect = refModal.current.getBoundingClientRect();
    refModal.current.removeClass("modal-hidden");
    refModal.current.removeClass("modal-begin-show");
    refModal.current.addClass("modal-begin-transition");
    await sleep(50);
    let sub = -refMouse.current.height;
    if (rect.bottom > refMouse.current.y) sub = refMouse.current.height;
    const transformOrigin = `${refMouse.current.x - rect.left}px ${
      refMouse.current.y - rect.top + sub
    }px`;
    refModal.current.addCss("transform-origin", transformOrigin);
    refModal.current.addClass("modal-show");
  }, []);

  const hideModal = useCallback(async () => {
    if (!refModal.current || !refBackdrop.current) return;
    refModal.current.addClass("modal-show-hidden");
    refBackdrop.current.addClass("modal-begin-hidden");
    refBackdrop.current.removeClass("modal-show");
    await sleep(300);
    refModal.current.removeClass("modal-show-hidden");
    refModal.current.addClass("modal-hidden");
    refModal.current.removeClass("modal-show");
    refModal.current.removeClass("modal-begin-transition");
    refBackdrop.current.addClass("modal-hidden");
  }, []);

  useEffect(() => {
    if (isOpen && !visible) setVisible(true);
    sleep(0).then(() => setOpen(!!isOpen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const disabledScroll = useCallback((isHidden: boolean) => {
    const html = document.querySelector("html");
    if (!html) return;
    html.style.overflow = isHidden ? "hidden" : "";
  }, []);

  useEffect(() => {
    disabledScroll(!!open);
    if (open) {
      showModal();
    } else hideModal();
    refOpen.current = !!isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function mouseDown(event: MouseEvent) {
      if (refOpen.current) return;
      refMouse.current.x = event.x;
      refMouse.current.y = event.y;
      refMouse.current.height =
        (event.target as HTMLElement)?.getBoundingClientRect?.().height || 0;
    }
    window.addEventListener("mousedown", mouseDown);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
    };
  }, []);

  const onCloseModal = useCallback(
    (event: MouseEventReact<HTMLDivElement>) => {
      if (refModal.current?.contains(event.target as Node)) return;
      onClose?.(event);
    },
    [onClose]
  );

  return createPortal(
    visible && (
      <ModalPortal>
        <ModalBackdrop
          ref={refBackdrop}
          className="modal-hidden"
          style={{ width: widthWindow }}
          onClick={onCloseModal}
        >
          <ModalWrapper
            ref={refModal}
            className="modal-hidden"
            style={{ width, ...style }}
          >
            {children}
          </ModalWrapper>
        </ModalBackdrop>
      </ModalPortal>
    ),
    document.querySelector("body")!
  );
};

const ModalPortal = styled("div")`
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  left: 0;
`;

const ModalBackdrop = styled("div")`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(23, 15, 9, 0.5);
  backdrop-filter: blur(7.5px);
  transition: opacity 0.28s;
  opacity: 0;
  display: flex;
  &.modal-hidden {
    display: none;
  }
  &.modal-begin-hidden {
    opacity: 0;
  }
  &.modal-show {
    opacity: 1;
  }
`;

const ModalWrapper = styled("div")`
  border-radius: 4px;
  width: 80%;
  background-color: ${(props) => props.theme?.colors?.white};
  margin: auto;
  transition: all 0.3s;
  &.modal-hidden {
    display: none;
  }
  &.modal-begin-show {
    transition: none;
    display: block;
    opacity: 0;
  }
  &.modal-begin-transition {
    transition: none;
    transform: scaleY(0) scaleX(0.2);
    display: block;
    opacity: 0;
  }
  &.modal-show {
    transition: transform 0.3s, opacity 0.3s;
    display: block;
    opacity: 1;
    transform: scaleY(1) scaleX(1);
  }
  &.modal-show-hidden {
    transition: transform 0.3s, opacity 0.3s;
    transform: scaleY(0) scaleX(0.2);
    opacity: 0;
  }
`;
