// @ts-nocheck
import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(function DialogOverlay(props, ref) {
  const { className = "", ...restProps } = props;

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={
        "fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
        className
      }
      {...restProps}
    />
  );
});

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(function DialogContent(props, ref) {
  const { className = "", children, ...restProps } = props;

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-2 border-gray-300 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl " +
          className
        }
        {...restProps}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = function DialogHeader(props) {
  const { className = "", ...restProps } = props;

  return (
    <div
      className={
        "flex flex-col space-y-1.5 text-center sm:text-left " + className
      }
      {...restProps}
    />
  );
};

DialogHeader.displayName = "DialogHeader";

const DialogFooter = function DialogFooter(props) {
  const { className = "", ...restProps } = props;

  return (
    <div
      className={
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 " +
        className
      }
      {...restProps}
    />
  );
};

DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(function DialogTitle(props, ref) {
  const { className = "", ...restProps } = props;

  return (
    <DialogPrimitive.Title
      ref={ref}
      className={
        "text-xl font-bold leading-none tracking-tight text-gray-900 " +
        className
      }
      {...restProps}
    />
  );
});

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(function DialogDescription(
  props,
  ref
) {
  const { className = "", ...restProps } = props;

  return (
    <DialogPrimitive.Description
      ref={ref}
      className={"text-base text-gray-700 leading-relaxed " + className}
      {...restProps}
    />
  );
});

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
