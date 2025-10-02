import React from 'react';

interface InfoboxProps {
  title?: string;
  data: Record<string, string>;
}

export function Infobox({ title, data }: InfoboxProps) {
  return (
    <aside className="float-right ml-4 mb-4 w-full md:w-80 border border-[var(--border)] bg-[var(--surface)] p-4">
      {title && (
        <h3 className="text-center font-serif text-lg font-normal border-b border-[var(--border)] pb-2 mb-3">
          {title}
        </h3>
      )}
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-b border-[var(--border)] last:border-b-0">
              <th className="text-left py-2 pr-3 font-semibold align-top w-1/3 text-[var(--text-secondary)]">
                {key}
              </th>
              <td className="py-2 align-top text-[var(--text)]">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
