export const kalenderClerkAppearance = {
  variables: {
    colorPrimary: "oklch(0.876 0.222 128.6)",
    colorBackground: "oklch(0.185 0.006 285.82)",
    colorText: "oklch(0.985 0 0)",
    colorTextSecondary: "oklch(0.705 0.011 285.82)",
    colorNeutral: "oklch(0.705 0.011 285.82)",
    borderRadius: "0.5rem",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox:
      "w-full overflow-hidden rounded-lg border border-border/80 bg-card shadow-[0_0_44px_-24px_var(--primary)]",
    card: "w-full border-0 bg-card px-6 py-6 text-card-foreground shadow-none sm:px-8 sm:py-8",
    header: "gap-2 text-left",
    headerTitle:
      "font-display text-2xl font-semibold tracking-normal text-foreground",
    headerSubtitle: "text-sm leading-6 text-muted-foreground",
    socialButtonsBlockButton:
      "h-11 border-border/80 bg-background text-foreground shadow-none hover:bg-accent hover:text-accent-foreground",
    dividerLine: "bg-border/80",
    dividerText: "text-muted-foreground",
    formFieldLabel: "text-sm font-medium text-foreground",
    formFieldInput:
      "h-11 border-border/80 bg-background text-foreground shadow-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30",
    formButtonPrimary:
      "h-11 bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
    footer: "border-border/80 bg-surface-subtle/60",
    footerActionText: "text-muted-foreground",
    footerActionLink: "font-semibold text-primary hover:text-primary",
    identityPreviewText: "text-foreground",
    formHeaderTitle:
      "font-display text-2xl font-semibold tracking-normal text-foreground",
    formHeaderSubtitle: "text-sm leading-6 text-muted-foreground",
    otpCodeFieldInput: "border-border/80 bg-background text-foreground",
    formResendCodeLink: "text-primary",
    alert: "border-border/80 bg-surface-subtle text-foreground",
    alertText: "text-foreground",
    formFieldErrorText: "text-destructive",
    footerPagesLink: "text-primary",
    userPreviewMainIdentifier: "text-foreground",
    userPreviewSecondaryIdentifier: "text-muted-foreground",
  },
} as const
