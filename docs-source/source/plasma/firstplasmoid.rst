Your First Plasmoid
===================

Tools
=====

KDE developers use a variety of tools to develop applets for the KDE Plasma desktop.
The two most important ones are CMake and ``plasmoidviewer``.

Obtaining CMake and ``plasmoidviewer``
======================================

|br|

.. container:: flex

   .. container:: 

      ::

         ➜ zypper install cmake plasma5-sdk extra-cmake-modules

      .. container::

         openSUSE

   .. container:: 

      ::

         ➜ dnf install cmake plasma-sdk extra-cmake-modules

      .. container::

         Fedora, Mageia

Preparing The Development Environment
=====================================

Create a folder named ``helloplasmoid``. This is where you will be developing your
plasmoid.

CMakeLists
==========

``CMakeLists.txt`` is how you describe to the system how to install your plasmoid.

Create a file named ``CMakeLists.txt`` file in the root of your ``helloplasmoid``
folder.

Minimum Version
---------------

Add a line with the following contents to ``CMakeLists.txt``:

.. code-block:: cmake

   cmake_minimum_required(VERSION 3.0)

This tells CMake that the oldest version that can install your plasmoid is version
3.0.

Extra CMake Modules
-------------------

KDE has a bunch of extra CMake modules available to make your life writing CMake
files a lot easier. You'll want to import them with the following line in your
``CMakeLists.txt`` file.

.. code-block:: cmake

   find_package(ECM REQUIRED NO_MODULE)
   set(CMAKE_MODULE_PATH ${ECM_MODULE_PATH} ${ECM_KDE_MODULE_DIR} ${CMAKE_MODULE_PATH})

The first line finds the extra CMake modules, and the second line tells CMake to
look for more modules in the path that KDE's extra CMake modules puts them.

The KF5Plasma Package
---------------------

The extra CMake modules has a package that allows you to install your plasmoids easily
—import it by adding this to your ``CMakeLists.txt`` file.

.. code-block:: cmake

   find_package(KF5Plasma REQUIRED)