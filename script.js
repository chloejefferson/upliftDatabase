$(document).ready(function () {
  // 1. Put YOUR published CSV URL below
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShj0-t7tQMmaoPrU9_1rvZognGEGsrPJ1vVVoLdOW0_Gk32ICvTd8hhUXuN8ikcHTZ5_hfN0laJzZo/pub?gid=0&single=true&output=csv";

  // 2. Parse the CSV via Papa Parse
  Papa.parse(csvUrl, {
    download: true,      // fetches the CSV from the URL
    header: true,        // first row of CSV is column headers
    skipEmptyLines: true,// ignore empty lines at bottom
    complete: function(results) {
      // 'results.data' is now an array of objects, each keyed by column header
      const data = results.data;
      // 'results.meta.fields' is an array of column headers
      const fields = results.meta.fields;

      // 1) Slice off the last three columns
      //    fields.slice(0, -3) takes all but the last 3 columns
      const shownFields = fields.slice(0, -3);

      // 2) Convert only those shownFields for each row
      const tableData = data.map(rowObj =>
        shownFields.map(fieldName => rowObj[fieldName] || "")
      );

      // 3) Build column definitions from shownFields
      const columns = shownFields.map(name => ({ title: name }));

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