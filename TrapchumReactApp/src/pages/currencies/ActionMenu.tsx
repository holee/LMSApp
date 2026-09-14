import { useState } from "react";

export type ActionMenuItem = { label: string; onSelect: () => void };

export function ActionMenu({ items }: { items: ActionMenuItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="currency-menu">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        &#8942;
      </button>
      {open && (
        <div className="currency-menu-pop" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
