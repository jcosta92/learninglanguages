"""Obrigado · Danke — trilingual EN / PT-PT / DE course, served through Streamlit.

The whole course is a single self-contained page (index.html). Streamlit only
hosts it: the page runs inside a component iframe and keeps each browser's
progress in that browser's localStorage.
"""
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Obrigado · Danke",
    page_icon="📘",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Remove Streamlit's own chrome and padding so the course fills the screen.
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility: hidden;}
      .block-container {padding: 0 !important; max-width: 100% !important;}
      iframe {display: block; border: 0;}
    </style>
    """,
    unsafe_allow_html=True,
)

html = (Path(__file__).parent / "index.html").read_text(encoding="utf-8")

# The page scrolls inside the iframe; the height is the visible window.
components.html(html, height=1000, scrolling=True)
