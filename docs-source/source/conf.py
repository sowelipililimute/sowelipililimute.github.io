# -*- coding: utf-8 -*-

project = 'jan Pontaoski\'s Trove of Docs'
copyright = '2019, Carson Black'
author = 'Carson Black'

version = '1.0'
release = ''

extensions = [
    'sphinx.ext.todo',
    'sphinx.ext.ifconfig',
    'sphinx.ext.githubpages',
]

templates_path = ['_templates']
source_suffix = '.rst'
master_doc = 'index'
language = None
exclude_patterns = []
html_theme = 'sphinx_rtd_theme'
html_theme_path = ['./aether-sphinx']
html_static_path = ['_static']
htmlhelp_basename = 'docsdoc'
todo_include_todos = True
rst_epilog = """

.. |br| raw:: html

   <br />

.. |nbsp| raw:: html

   &#160;

"""

rst_prolog = """
.. role:: iconred
.. role:: plasmablue
.. role:: noblefir
.. role:: ambientamber
.. role:: intend
.. role:: nimi
.. role:: fblue
.. role:: ogreen
"""

pygments_style = 'monokai'
def setup(app):
    app.add_stylesheet('css/app.css')
    app.add_javascript('js/app.js')
