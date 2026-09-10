import styles from './DataTable.module.css';

export default function DataTable({ columns, rows, rowKey = '_id', onRowClick }) {
  return (
    <div className={styles.wrap} role="region" aria-label="Data table">
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? styles.clickable : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} data-label={col.label}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
