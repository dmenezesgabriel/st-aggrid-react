# Streamlit AgGrid React

- [ag-grid getting started](https://www.ag-grid.com/react-data-grid/getting-started/)

## Development

- **React side**:

```sh
cd aggrid/frontend && \
npm install && \
npm run dev
```

- **Streamlit side**:

```sh
streamlit run example.py
```

## Build

```sh
cd aggrid/frontend && \
npm run build
```

Then in `aggrid/__init__.py` RELEASE constant should be set to `True`.
