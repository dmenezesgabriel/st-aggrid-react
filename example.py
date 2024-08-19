import pandas as pd
import streamlit as st

from aggrid import aggrid

st.set_page_config(layout="wide")

df = pd.DataFrame(
    [
        {
            "Product": "Laptop",
            "Category": "Electronics",
            "Price": 1200,
            "Stock": 50,
            "Brand": "BrandA",
        },
        {
            "Product": "Smartphone",
            "Category": "Electronics",
            "Price": 800,
            "Stock": 150,
            "Brand": "BrandB",
        },
        {
            "Product": "Tablet",
            "Category": "Electronics",
            "Price": 300,
            "Stock": 100,
            "Brand": "BrandC",
        },
        {
            "Product": "Headphones",
            "Category": "Accessories",
            "Price": 150,
            "Stock": 200,
            "Brand": "BrandD",
        },
        {
            "Product": "Smartwatch",
            "Category": "Wearables",
            "Price": 200,
            "Stock": 120,
            "Brand": "BrandE",
        },
    ]
)

column_defs = [
    {
        "colId": "product",
        "field": "Product",
        "filter": True,
        "editable": True,
        "pinned": "left",
    },
    {
        "colId": "category",
        "field": "Category",
        "filter": True,
        "editable": True,
    },
    {
        "colId": "price",
        "field": "Price",
        "filter": True,
        "editable": True,
        "valueFormatter": "value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })",
    },
    {
        "colId": "stock",
        "field": "Stock",
        "filter": True,
        "editable": True,
    },
    {
        "colId": "brand",
        "field": "Brand",
        "filter": True,
        "editable": True,
    },
]

edited_dataframe = aggrid(
    df=df,
    column_defs=column_defs,
    style={"height": "280px", "width": "100%"},
    locale_text="AG_GRID_LOCALE_BR",
    row_selection="multiple",
    pagination=False,
    key="my_grid",
)
st.write(edited_dataframe)
