$(document).ready(function () {
  // 1. Your published CSV URL
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShj0-t7tQMmaoPrU9_1rvZognGEGsrPJ1vVVoLdOW0_Gk32ICvTd8hhUXuN8ikcHTZ5_hfN0laJzZo/pub?gid=0&single=true&output=csv";

  // 2. Parse the CSV with Papa Parse
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      // results.data = array of objects, results.meta.fields = column headers
      const data = results.data;
      const fields = results.meta.fields;

      // 3. Slice off the last 3 columns
      //    (If Link is in those last 3, you'll need to reduce this slice.)
      const shownFields = fields.slice(0, -3);

      // Log columns to confirm Link is present
      console.log("Columns after slice:", shownFields);

      // 4. Convert shownFields for each row into array-of-arrays for DataTables
      const tableData = data.map(rowObj =>
        shownFields.map(fieldName => rowObj[fieldName] || "")
      );

      // 5. Build column definitions, making "Link" clickable
      const columns = shownFields.map(name => {
        if (name === "Link") {
          // If your CSV column is literally named "Link" (capital L)
          return {
            title: name,
            render: function(data) {
              if (!data) return "";
              // Make the URL clickable
              return '<a href="' + data + '" target="_blank">' + data + '</a>';
            }
          };
        } else {
          // Normal column
          return { title: name };
        }
      });

      // 6. Initialize DataTables
      $("#myTable").DataTable({
        data: tableData,
        columns: columns,
        pageLength: 5,
        responsive: true
      });
    },
    error: function(err) {
      console.error("Papa Parse error:", err);
    }
  });
});
