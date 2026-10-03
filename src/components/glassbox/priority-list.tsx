"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./glassbox.module.css";

export interface RankedItem {
  name: string;
  addedByHuman?: boolean;
}

interface PriorityListProps {
  items: RankedItem[];
  onChange: (items: RankedItem[]) => void;
}

/**
 * Force-ranked, no-ties priority list. Drag anywhere on a row to reorder;
 * works with mouse and touch via pointer events. Rows can be removed.
 */
export function PriorityList({ items, onChange }: PriorityListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  // Refs mirror drag state so rapid pointermove events don't read stale
  // React state between re-renders.
  const dragRef = useRef<number | null>(null);
  const orderRef = useRef(items);
  const grabY = useRef(0);
  const slotHeight = useRef(0);

  useEffect(() => {
    orderRef.current = items;
  }, [items]);

  function handlePointerDown(
    e: React.PointerEvent<HTMLLIElement>,
    index: number,
  ) {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    // Row height + the list's 8px gap; rows are uniform.
    slotHeight.current = rect.height + 8;
    grabY.current = e.clientY;
    dragRef.current = index;
    setDragIndex(index);
    setOffsetY(0);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLLIElement>) {
    const from = dragRef.current;
    if (from === null) return;
    const current = orderRef.current;
    const dy = e.clientY - grabY.current;
    const slots = Math.round(dy / slotHeight.current);
    const target = Math.min(Math.max(from + slots, 0), current.length - 1);

    if (target !== from) {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(target, 0, moved);
      orderRef.current = next;
      onChange(next);
      grabY.current += (target - from) * slotHeight.current;
      dragRef.current = target;
      setDragIndex(target);
      setOffsetY(e.clientY - grabY.current);
    } else {
      setOffsetY(dy);
    }
  }

  function handlePointerUp() {
    dragRef.current = null;
    setDragIndex(null);
    setOffsetY(0);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <ol ref={listRef} className={styles.rankList}>
      {items.map((item, i) => {
        const dragging = dragIndex === i;
        const classes = [
          styles.rankItem,
          i === 0 ? styles.rankItemTop : "",
          dragging ? styles.rankItemDragging : "",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <li
            key={item.name}
            className={classes}
            style={
              dragging ? { transform: `translateY(${offsetY}px)` } : undefined
            }
            onPointerDown={(e) => handlePointerDown(e, i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <span className={styles.rankNum}>{i + 1}</span>
            <span className={styles.rankName}>
              {item.name}
              {item.addedByHuman && (
                <span className={styles.rankAdded}> · you added</span>
              )}
            </span>
            <button
              type="button"
              className={styles.rankRemove}
              aria-label={`Remove ${item.name}`}
              onClick={() => remove(i)}
            >
              ×
            </button>
            <span className={styles.rankGrip} aria-hidden>
              ⠿
            </span>
          </li>
        );
      })}
    </ol>
  );
}
