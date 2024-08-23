import React, { useState, useEffect, CSSProperties } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  ColDef,
  RowValueChangedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  Streamlit,
  withStreamlitConnection,
  RenderData,
} from "streamlit-component-lib";

const App: React.FC = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [localeText, setLocaleText] = useState<Record<string, string>>({});
  const [rowSelection, setRowSelection] = useState<
    "single" | "multiple" | undefined
  >(undefined);
  const [style, setStyle] = useState<CSSProperties>({});
  const [pagination, setPagination] = useState<boolean>(false);

  useEffect(() => {
    // This function is called every time the component is rendered by Streamlit.
    const onRender = (event: Event) => {
      const renderData = (event as CustomEvent<RenderData>).detail;

      setRowData(renderData.args["rowData"] || []);
      setColumnDefs(renderData.args["columnDefs"] || []);
      setStyle(renderData.args["style"] || {});
      setRowSelection(renderData.args["rowSelection"]);
      setPagination(renderData.args["pagination"] || false); // Set pagination state
      loadLocale(renderData.args["localeText"]);
      const theme = renderData.theme;
      if (theme) {
        // https://www.ag-grid.com/react-data-grid/global-style-customisation-colours/
        // www.ag-grid.com/react-data-grid/global-style-customisation-widgets/
        const customStyles = `
          .ag-theme-quartz {
            --ag-foreground-color: ${theme.primaryColor || "var(--text-color)"};
            --ag-header-background-color: ${theme.backgroundColor};
            --ag-panel-background-color: ${theme.primaryColor};
            --ag-active-color: ${theme.primaryColor || "var(--primary-color)"};
            --ag-background-color: ${theme.backgroundColor};
            --ag-odd-row-background-color: var(--secondary-background-color);
            --ag-header-foreground-color: ${theme.textColor};
            --ag-font-family: ${theme.font || "var(--font)"};
            --ag-row-hover-color: var(--secondary-background-color);
            --ag-border-color: var(--secondary-background-color);
            --ag-row-foreground-color: ${theme.textColor};
            --ag-data-color: ${theme.textColor || "var(--text-color)"};
            --ag-icon-color: ${theme.textColor || "var(--text-color)"};
            --ag-tooltip-background-color: var(--tooltip-background-color);
            --ag-disabled-foreground-color: var(--disabled-foreground-color);
            --ag-selected-row-background-color: var(--selected-row-background-color);
            --ag-menu-background-color: ${theme.backgroundColor};
            --ag-row-border-color: var(--row-border-color);
            --ag-header-cell-hover-background-color: var(--header-cell-hover-background-color);
            --ag-header-cell-moving-background-color: var(--header-cell-moving-background-color);
            --ag-checkbox-checked-color: var(--checkbox-checked-color);
            --ag-checkbox-unchecked-color: var(--checkbox-unchecked-color);
            --ag-input-border-color: var(--input-border-color);
            --ag-input-focus-border-color: var(--input-focus-border-color);
            --ag-input-disabled-border-color: var(--input-disabled-border-color);

            .ag-text-field-input, .ag-number-field-input {
              background-color: var(--secondary-background-color);
            }
          }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = customStyles;
        document.head.appendChild(styleSheet);
      }
      const currentHeight = document.documentElement.scrollHeight;
      Streamlit.setFrameHeight(currentHeight);
    };

    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);
    Streamlit.setComponentReady();

    // Cleanup the event listener on unmount
    return () => {
      Streamlit.events.removeEventListener(Streamlit.RENDER_EVENT, onRender);
    };
  }, []);

  const loadLocale = async (locale: string) => {
    try {
      const module = await import("@ag-grid-community/locale");
      setLocaleText(module[locale] || {});
    } catch (error) {
      console.error(`Failed to load locale ${locale}:`, error);
    }
  };

  const onCellValueChanged = (event: RowValueChangedEvent) => {
    // Send updated data back to Streamlit
    Streamlit.setComponentValue({
      edited: {
        index: event.rowIndex,
        field: event.colDef.field,
        colId: event.colDef.colId,
        oldValue: event.oldValue,
        newValue: event.newValue,
        data: event.data,
      },
    });
  };

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      // Return the selected row data to Streamlit
      Streamlit.setComponentValue({ selected: selectedRows });
    }
  };

  return (
    <div className="ag-theme-quartz" style={style}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        localeText={localeText}
        rowSelection={rowSelection}
        pagination={pagination} // Enable pagination if the prop is true
        onCellValueChanged={onCellValueChanged}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
};

// Wrap the component with Streamlit's connection
const WrappedApp = withStreamlitConnection(App);

export default WrappedApp;
