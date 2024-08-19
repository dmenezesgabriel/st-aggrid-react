import os
from typing import Any, Dict, Literal, Optional

import pandas as pd
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
_RELEASE = False

if not _RELEASE:
    _component_func = components.declare_component(
        "ag_grid",
        url="http://localhost:5173",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/dist")
    _component_func = components.declare_component("ag_grid", path=build_dir)

AGGridLocale = Literal[
    "AG_GRID_LOCALE_EG",
    "AG_GRID_LOCALE_BG",
    "AG_GRID_LOCALE_HK",
    "AG_GRID_LOCALE_CN",
    "AG_GRID_LOCALE_TW",
    "AG_GRID_LOCALE_HR",
    "AG_GRID_LOCALE_CZ",
    "AG_GRID_LOCALE_DK",
    "AG_GRID_LOCALE_NL",
    "AG_GRID_LOCALE_FI",
    "AG_GRID_LOCALE_FR",
    "AG_GRID_LOCALE_DE",
    "AG_GRID_LOCALE_GR",
    "AG_GRID_LOCALE_IL",
    "AG_GRID_LOCALE_HU",
    "AG_GRID_LOCALE_IT",
    "AG_GRID_LOCALE_JP",
    "AG_GRID_LOCALE_KR",
    "AG_GRID_LOCALE_NO",
    "AG_GRID_LOCALE_IR",
    "AG_GRID_LOCALE_PL",
    "AG_GRID_LOCALE_PT",
    "AG_GRID_LOCALE_BR",
    "AG_GRID_LOCALE_RO",
    "AG_GRID_LOCALE_SK",
    "AG_GRID_LOCALE_ES",
    "AG_GRID_LOCALE_SE",
    "AG_GRID_LOCALE_TR",
    "AG_GRID_LOCALE_UA",
    "AG_GRID_LOCALE_PK",
    "AG_GRID_LOCALE_VN",
]

AGGridRowSelection = Literal["single", "multiple"]


def aggrid(
    df: pd.DataFrame,
    column_defs,
    locale_text: AGGridLocale = "AG_GRID_LOCALE_BR",
    row_selection: AGGridRowSelection = "single",
    style: Optional[Dict[str, Any]] = None,
    pagination: bool = False,  # New argument for pagination
    key=None,
):
    row_data = df.to_dict(orient="records")

    component_value = _component_func(
        rowData=row_data,
        columnDefs=column_defs,
        localeText=locale_text,
        rowSelection=row_selection,
        style=style,
        pagination=pagination,  # Pass pagination argument to the frontend
        key=key,
        default={},
    )

    return component_value
