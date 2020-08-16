In-Depth Packaging
==================

This tutorial assumes that you've completed the `get started tutorial <firstpkg.html>`_
and have a working specfile that you have built. If you have not done that,
please complete that tutorial and come back later. Your specfile shoud look like
this:

.. code-block:: spec

   Name:    hello
   Version: 2.10
   Release: 1
   License: GPLv3+
   URL:     https://www.gnu.org/software/hello/
   Summary: GNU's Hello World Program

   Source0: https://ftp.gnu.org/gnu/hello/hello-%{version}.tar.gz

   BuildRequires: gcc
   BuildRequires: make
   BuildRequires: gettext

   %description
   The "Hello World" program, done with all bells and whistles of a proper FOSS
   project, including configuration, build, internationalization, help files, etc.

   %prep
   %autosetup

   %build
   %configure
   %make_build

   %install
   %make_install

   %files
   %{_bindir}/hello
   %{_datadir}/info/hello.info.gz
   %{_datadir}/man/man1/hello.1.gz
   %{_datadir}/locale/*/LC_MESSAGES/hello.mo

   %changelog
   * Wed Dec 18 2019 Firstname Lastname <email.com> 2.10-1
   - Initial packaging for distro

Subpackages
===========

The core aspect of this tutorial is the subpackage. A specfile is able to create
multiple packages from one larger package, and this is called subpackaging. This
is often done for development files, debugging files, translations, etc.

Unlike a full package, subpackages cannot live without a parent package. Instead,
they're simply a separated listing of files shipped as its own package.

``%find_lang``
==============

The ``%find_lang`` macro is what will do most of the heavy lifting for us when it
comes to translations. You want to give it your package's name as an argument,
which can be done with the ``%{name}`` macro. Add this to the end of your ``%install`` section:

.. code-block:: spec

   %find_lang %{name}

This will create an internal list of files corresponding to all translations.

You will want to remove the ``%{_datadir}/locale/*/LC_MESSAGES/hello.mo`` entry
in ``%files``, as we will be putting this in a separate ``%files`` section later.

Declaring the Subpackage
========================

At the end of the body but before the changelog, we want to declare a new ``%package``.
When you declare a new ``%package``, you need to give it a subpackage name as an argument.
This subpackage name will become appended to the parent package's name, generating the
package name that the end user will see. If a specfile has a ``Name: hello`` and a ``%package world``,
the specfile will produce two packages: ``hello`` and ``hello-world``.

Since we're creating a subpackage to hold translations, our subpackage should be named
``lang``. Declare that like so:

.. code-block:: spec

   %package lang

Just like a regular package, a subpackage will need a ``Summary:`` and a ``%description``.
The ``%{name}`` macro can be used to use the name of the parent package.

Go ahead and add those under the ``%package`` directive like so: 

.. code-block:: spec

   %package lang
   Summary: Translations for %{name}
   
   %description lang
   This package provides translation files for %{name}.

This is a basic subpackage, but we need to do two things: Add a ``Requires:`` tag
and a ``Supplements:`` tag.

Requires
--------

There's no reason to install translations for a program you don't have, right?
This is what the ``Requires:`` tag is used for. It allows you to mandate that
another package be installed in order for a package to be installed. 

Add a ``Requires:`` tag to your subpackage like so:

.. code-block:: spec

   %package lang
   Requires: %{name}

Wouldn't it be nice if you could make sure the correct translation versions were always
paired up with the correct program version? You can do this by adding ``= %{version}-%{release}``
to the end of the ``Requires:`` tag. Add them like so: 

.. code-block:: spec

   %package lang
   Requires: %{name} = %{version}-%{release}

This means that translation and program packages produced by the same specfile will
always want to be the same version.

Supplements
-----------

We have our package split, but we don't actually suggest to the package manager that
we install translations. This is where the ``Supplements:`` tag comes in. It tells
the package manager that our subpackage supplements the parent package.

Just like the requires tag wanting to always be with the same version of the parent package,
we should only want to suggest that this package be installed for the same version of
the parent package.

Add this to your ``%package lang`` section:

.. code-block:: spec

   Supplements: %{name} = %{version}-%{release}


Your subpackage declaration should look like this: 

.. code-block:: spec

   %package lang
   Requires: %{name} = %{version}-%{release}
   Supplements: %{name} = %{version}-%{release}
   Summary: Translations for %{name}

   %description lang
   This package provides translation files for %{name}.

Putting Something in the Subpackage
===================================

We have our subpackage, and we have our language files list, but how do we put them
together? We add another ``%files`` section for the subpackage.

Just like ``%package`` and ``%description``, we add the name of the subpackage
to ``%files``. However, since we already have an internal files list, we'll
be doing something new.

We want to tell the ``%files lang`` section to use the list of files made by
the ``%find_lang`` macro we used earlier. We add the ``-f`` flag to ``%files``,
followed by the name of the list ``%find_lang`` generated. For our package, this
is called ``%{name}.lang``

Assembling all the pieces together, that results in this:

.. code-block:: spec

   %files lang -f %{name}.lang

Your subpackage should now look like this: 

.. code-block:: spec

   %package lang
   Requires: %{name} = %{version}-%{release}
   Supplements: %{name} = %{version}-%{release}
   Summary: Translations for %{name}

   %description lang
   This package provides translation files for %{name}.

   %files lang -f %{name}.lang

Finishing Touches
=================

Now that we've split our language files into a subpackage, we should add a new
entry to our changelog and increment our release version. Change ``Release: 1``
to ``Release: 2``, as this is how we tell the package manager that something changed
in the package that wasn't the package's program itself.

Changelog entries are newer at the top and older at
the bottom, so put the new entry at the top of the section. It should look
something like this:

.. code-block:: spec

   %changelog
   * Fri Dec 20 2019 Firstname Lastname <email.com> 2.10-2
   - Split language files into subpackage

   * Wed Dec 18 2019 Firstname Lastname <email.com> 2.10-1
   - Initial packaging for distro

Our specfile should now look like this: 

.. code-block:: spec

   Name:    hello
   Version: 2.10
   Release: 2
   License: GPLv3+
   URL:     https://www.gnu.org/software/hello/
   Summary: GNU's Hello World Program

   Source0: https://ftp.gnu.org/gnu/hello/hello-%{version}.tar.gz

   BuildRequires: gcc
   BuildRequires: make
   BuildRequires: gettext

   %description
   The "Hello World" program, done with all bells and whistles of a proper FOSS
   project, including configuration, build, internationalization, help files, etc.

   %prep
   %autosetup

   %build
   %configure
   %make_build

   %install
   %make_install
   %find_lang %{name}

   %files
   %{_bindir}/hello
   %{_datadir}/info/hello.info.gz
   %{_datadir}/man/man1/hello.1.gz

   %package lang
   Requires: %{name} = %{version}-%{release}
   Supplements: %{name} = %{version}-%{release}
   Summary: Translations for %{name}

   %description lang
   This package provides translation files for %{name}.

   %files lang -f %{name}.lang

   %changelog
   * Fri Dec 20 2019 Firstname Lastname <email.com> 2.10-2
   - Split language files into subpackage

   * Wed Dec 18 2019 Firstname Lastname <email.com> 2.10-1
   - Initial packaging for distro

.. container:: flex

   .. figure:: /img/fedora-icon.png
      :target: index.html
      :figclass: related-link
      
      :nimi:`Fedora Packaging` |br|
      Learn how to expand this tutorial into
      a package following Fedora guidelines

   .. figure:: /img/opensuse-icon.png
      :target: index.html
      :figclass: related-link
      
      :nimi:`openSUSE Packaging` |br|
      Learn how to expand this tutorial into
      a package following openSUSE guidelines