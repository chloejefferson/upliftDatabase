$(document).ready(function () {
  // 1. Your published CSV URL
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShj0-t7tQMmaoPrU9_1rvZognGEGsrPJ1vVVoLdOW0_Gk32ICvTd8hhUXuN8ikcHTZ5_hfN0laJzZo/pub?gid=0&single=true&output=csv";

  // 2. Parse the CSV via Papa Parse
  Papa.parse(csvUrl, {
    download: true,      // fetches the CSV from the URL
    header: true,        // first row = column headers
    skipEmptyLines: true,// ignore empty lines
    complete: function(results) {
      // 'results.data' is an array of objects, each keyed by column header
      const data = results.data;
      // 'results.meta.fields' is an array of column headers
      const fields = results.meta.fields;

      // 1) Slice off the last three columns
      const shownFields = fields.slice(0, -3);

      // 2) Convert only those shownFields for each row
      const tableData = data.map(rowObj =>
        shownFields.map(fieldName => rowObj[fieldName] || "")
      );

      // 3) Build column definitions, making 'link' clickable
      const columns = shownFields.map(name => {
        if (name.toLowerCase() === "link") {
          return {
            title: name,
            render: function(data) {
              if (!data) return "";
              return '<a href="' + data + '" target="_blank">' + data + '</a>';
            }
          };
        } else {
          return { title: name };
        }
      });

      // 4) Initialize DataTables
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
