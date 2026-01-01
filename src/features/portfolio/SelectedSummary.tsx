export default function SelectedSummary({
  count,
  total,
}: {
  count: number;
  total: number;
}) {
  return (
    <details style={{ marginTop: "30px" }} name="example" open>
      <summary>Selected Summary</summary>
      <article>
        <p>Count: {count}</p>
        <p>Total: {total}</p>
      </article>
    </details>
  );
}
