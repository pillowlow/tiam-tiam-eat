export type Theme = "light" | "black";

type Props = {
  label: string;
  isBlack: boolean;
  onToggle: () => void;
};

export function ThemeSwitch({ label, isBlack, onToggle }: Props) {
  return (
    <button
      aria-pressed={isBlack}
      className={isBlack ? "theme-button is-active" : "theme-button"}
      onClick={onToggle}
      type="button"
    >
      {label}
    </button>
  );
}
