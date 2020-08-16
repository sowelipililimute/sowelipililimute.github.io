Your First Package
==================

Tools
=====

RPM distros use a variety of tools, such as ``mock``, ``build``, ``koji``, and
others. However, all distros use the baseline ``rpmbuild``. It is important
to understand how to use ``rpmbuild`` when packaging, as all other tools use
this tool.

Obtaining ``rpmbuild`` and ``rpmdev-setuptree``
===============================================

|br|

.. container:: flex

   .. container:: 

      ::

         ➜ zypper install rpm-build rpmdevtools

      .. container::

         openSUSE

   .. container:: 

      ::

         ➜ yum install rpm-build rpmdevtools

      .. container::

         RHEL, CentOS

   .. container:: 

      ::

         ➜ dnf install rpm-build rpmdevtools

      .. container::

         Fedora, Mageia, OpenMandriva

|br|

.. container:: flex

   .. container:: 

      ::

         ➜ toolbox create -c rpm-dev
         ➜ toolbox enter rpm-dev
         ⬢ zypper install rpm-build rpmdevtools

      .. container::

         openSUSE MicroOS

   .. container:: 

      ::

         ➜ toolbox create -c rpm-dev
         ➜ toolbox enter rpm-dev
         ⬢ dnf install rpm-build rpmdevtools

      .. container::

         Fedora Silverblue

Preparing the Development Environment
=====================================

``rpmbuild`` works from a specific set of directories in your home directory.
To set these up, run ``rpmdev-setuptree``. This will create a directory called
``rpmbuild`` in your home directory. There will be six folders in it. 

Directories in ``~/rpmbuild``
-----------------------------

========== ==================================================================
Directory  Purpose
========== ==================================================================
BUILD      BUILD is where programs are built
BUILDROOT  BUILDROOT is where the RPM's contents are laid out before packing.
RPMS       RPMS is where built RPMS are placed.
SOURCES    ``rpmbuild`` will look for source files here.
SPECS      This is where you want to store specfiles.
SRPMS      This is where built source RPMS are placed.
========== ==================================================================

Specfiles
=========

Specfiles tell ``rpmbuild`` how to turn sources into a compiled RPM that you
can share to users.

They look like this:

.. code-block:: spec
   
   Key: Value

   command_to_run %{macro}

Hello World
===========

For this tutorial, we'll be packaging GNU Hello. To start off, we'll need some
sources to package.


Setting Up
----------

Open up a terminal, and navigate into ``~/rpmbuild/SOURCES``.

::

   $ cd ~/rpmbuild/SOURCES

You'll want to download the tarball into here.

::

   $ wget http://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz

Metadata
--------

This is when we want to create an empty specfile. Naming convention is to name
the spec the same as the package it describes. This is where we learn our first
tag: ``Name:``. 

.. container:: flex

   .. container:: do

      .. code-block:: spec

         Name: hello

      .. container:: caption

         :noblefir:`Do.` |br|
         Use a relevant name similar to the upstream name.

   .. container:: dont

      .. code-block:: spec

         Name: sweet-flying-pingas

      .. container:: caption

         :iconred:`Don't.` |br|
         Don't use a name with no relation to the upstream name.

|br|

Create a file named ``hello.spec``, and add ``Name: hello`` to it. A program
has a name, but what else does it have? A version. This is what the ``Version:``
tag describes.

.. container:: flex

   .. container:: do

      .. code-block:: spec

         Version: 2.10

      .. container:: caption

         :noblefir:`Do.` |br|
         Version your package based off the version of the upstream version.

   .. container:: dont

      .. code-block:: spec

         Version: 4.20.69

      .. container:: caption

         :iconred:`Don't.` |br|
         Don't use a version with no relation to the upstream version.

|br|

Add an appropriate version tag to your specfile. RPM also has a second type of 
version, referred to as a release. Releases are the version of the package itself,
and not the program. Packaging tradition for releases depends on distro, but for
the sake of this tutorial, we'll be giving our RPM a release version of 1. This
is done with the ``Release:`` tag.

.. code-block:: spec

   Release: 1

|br|

Every program has a license, and we need to indicate one in our specfile. For
GNU Hello, the license is GNU GPL v3 or later, and we indicate that with the 
``License:`` tag. Different distros prefer different ways of writing this.

Add one of these to your specfile: 

.. container:: flex

   .. container:: fedora

      .. code-block:: spec

         License: GPLv3+

      .. container:: caption

         :fblue:`Fedora.` |br|
         Fedora uses ``GPLv3+`` to indicate this license.

   .. container:: opensuse

      .. code-block:: spec

         License: GPL-3.0-or-later

      .. container:: caption

         :ogreen:`openSUSE.` |br|
         openSUSE  uses ``GPL-3.0-or-later`` to indicate this license.

|br|

There's one last piece of metadata about upstream that we need to add— the URL.
This is not an URL to an archive or sources, but rather to a webpage for humans.
We describe the URL with the ``URL:`` tag. Add one to your specfile.

.. container:: flex

   .. container:: do

      .. code-block:: spec

         URL: https://www.gnu.org/software/hello/

      .. container:: caption

         :noblefir:`Do.` |br|
         Use a URL that leads to a page that a human can read.

   .. container:: dont

      .. code-block:: spec

         URL: https://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz

      .. container:: caption

         :iconred:`Don't.` |br|
         Don't use a URL that leads to source files— this is not the intended
         usage of the URL tag.

|br|

After adding the URL tag, your specfile should look something like this:

.. code-block:: spec

   Name: hello
   Version: 2.10
   Release: 1
   License: GPLv3+
   URL: https://www.gnu.org/software/hello/

*hello.spec*

|br| 

You may notice that the specfile's indentation is not consistent. An RPM spec
formatting standard is to align everything to the right of the colon (``:``).

Format your specfile to look like this:

.. code-block:: spec

   Name:    hello
   Version: 2.10
   Release: 1
   License: GPLv3+
   URL:     https://www.gnu.org/software/hello/

*hello.spec*

|br|

This formatting is much more visually pleasing than leaving it unaligned.

There's one more piece of metadata you'll want to add before working on getting
your package to build something: The summary. A summary is a summary of the program
your package offers. It should be capitalised and it should not end in a period.
You use the ``Summary:`` tag to add one. You should be able to add a summary tag
without my help.

Building Metadata
-----------------

We've described what our specfile is supposed to provide, but what about how
we're going to build the package? This is where building metadata comes into play.
The first thing we need to do is to tell RPM where our source is located.

This is where the ``SourceX:`` tags come into play. For every source, you use one of these.
You increase X by 1, starting from 0 for every source you have. (``Source0:``,
``Source1:``, ``Source2:``, ...)

You'll want to add a ``Source0:`` tag pointing to
``https://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz``. You should add an extra
line between the ``Source0:`` tag and the tags that come before it. Ths chunks
your specfile's tags into something organised by sections.

.. code-block:: spec

   Name:    hello
   Version: 2.10
   Release: 1
   License: GPLv3+
   URL:     https://www.gnu.org/software/hello/
   Summary: GNU's Hello World Program

   Source0: https://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz

*hello.spec*

|br|

You may notice that you've written the version of GNU Hello twice in this specfile—
once in the Version tag, and again in the Source0 tag. Wouldn't it be nice if you
could only write it once? That's what macros are for. Macros are extremely complex,
but for the Source0 tag here, you only need to know the ``%{version}`` macro. This
macro gets replaced by the value of the ``Version:`` tag in the specfile, which
happens to be ``2.10``. Replace the 2.10 in the Source0 tag with a macro.

.. container:: flex

   .. container:: dont

      .. code-block:: spec

         Source0: https://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz

      .. container:: caption

         :iconred:`Don't.` |br|
         Don't duplicate information in your specfile— use macros to keep your
         specfile DRY. (Don't Repeat Yourself)

   .. container:: do

      .. code-block:: spec

         Source0: https://ftp.gnu.org/gnu/hello/hello-%{version}.tar.gz

      .. container:: caption

         :noblefir:`Do.` |br|
         Use macros in appropriate places to only write information once.

|br|

Build Requirements
++++++++++++++++++

Every package needs stuff to be built. In this case, GNU Hello needs some things:
the ``gcc`` compiler, the ``make`` build system, and the ``gettext`` i18n system. 
This is where the ``BuildRequires:`` tag comes into play. ``BuildRequires:`` allows
you to specify what you need to build the package, but not what you need to run
the package. Add a ``BuildRequires:`` for each dependency to your specfile.

.. code-block:: spec

   BuildRequires: gcc
   BuildRequires: make
   BuildRequires: gettext

*Listing build dependencies in an RPM specfile. Note that package names may
vary per distro.*

After the Tags
==============

Your specfile should now look like this: 

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

*hello.spec*

Now that we've added all the tags we've needed to add for now, we can get onto
the package itself.

Longer Description, Please
--------------------------

First thing we need to add is a long-form description for the package.
Instead of using a tag like we used before, we're going to mark a section
in our package with ``%description``. A description should be longer than
the summary. For GNU hello, we can use this description:

.. code-block:: spec

   The "Hello World" program, done with all bells and whistles of a proper FOSS
   project, including configuration, build, internationalization, help files, etc.

Add this to your specfile like so:

.. code-block:: spec

   %description
   The "Hello World" program, done with all bells and whistles of a proper FOSS
   project, including configuration, build, internationalization, help files, etc.

Preparing to Build
------------------

The ``%prep`` section tells ``rpmbuild`` how to prepare the sources for building
and installation. For most specfiles, this process is simple. The preferred
method depends on distro. Add one of these to your specfile.

.. container:: flex

   .. container:: fedora

      .. code-block:: spec

         %prep
         %autosetup

      .. container:: caption

         :fblue:`Fedora.` |br|
         Fedora prefers to use the ``%autosetup`` macro in ``%prep``.

   .. container:: opensuse

      .. code-block:: spec

         %prep
         %setup -q

      .. container:: caption

         :ogreen:`openSUSE.` |br|
         openSUSE prefers to use ``%setup -q`` in ``%prep``.

Building
--------

Now, we're at the building step of the specfile. We have two macros that we
want to use: ``%configure`` and ``%make_build``. These two macros are for
the autotools build system that GNU Hello uses. They correspond to
running the ``./configure`` and ``make`` commands.

We want to declare the ``%build`` section in the specfile and then add these
macros.

Add these to your specfile like so:

.. code-block:: spec

   %build
   %configure
   %make_build

Installing
----------

Now, we've built the programs, but we need to install them into RPM's virtual
root so that it knows to put them into the package. This is what the ``%install``
section does. For the autotools build system, we can just use the ``%make_install``
macro here. Add it to the specfile like so:

.. code-block:: spec

   %install
   %make_install

File Listing
------------

Your specfile is just about done, you only need to add two more things, the first
one being a listing of files the package offers. RPMs list files to ensure that
all expected files are in the package, even when the sources change.

We list files in the ``%files`` section, and we use a variety of macros to point
to common paths. For this program, we'll need ``%{_bindir}`` and ``%{_datadir}``.

We also have a COPYING and a README file that we should install as well. For licenses
and documentation files, we use special macros that copy them to appropriate places.
For licenses, it's ``%license``, and for docs, it's ``%doc``. 

You can use ``*`` wildcards in the ``%files`` section, but be sure to not overuse them.

If you try to build GNU Hello without a ``%files`` section, RPM will complain that
the following files are unpackaged: 

.. code-block:: spec

   /usr/bin/hello
   /usr/share/info/hello.info.gz
   /usr/share/locale/bg/LC_MESSAGES/hello.mo
   /usr/share/locale/ca/LC_MESSAGES/hello.mo
   /usr/share/locale/da/LC_MESSAGES/hello.mo
   /usr/share/locale/de/LC_MESSAGES/hello.mo
   /usr/share/locale/el/LC_MESSAGES/hello.mo
   /usr/share/locale/eo/LC_MESSAGES/hello.mo
   /usr/share/locale/es/LC_MESSAGES/hello.mo
   /usr/share/locale/et/LC_MESSAGES/hello.mo
   /usr/share/locale/eu/LC_MESSAGES/hello.mo
   /usr/share/locale/fa/LC_MESSAGES/hello.mo
   /usr/share/locale/fi/LC_MESSAGES/hello.mo
   /usr/share/locale/fr/LC_MESSAGES/hello.mo
   /usr/share/locale/ga/LC_MESSAGES/hello.mo
   /usr/share/locale/gl/LC_MESSAGES/hello.mo
   /usr/share/locale/he/LC_MESSAGES/hello.mo
   /usr/share/locale/hr/LC_MESSAGES/hello.mo
   /usr/share/locale/hu/LC_MESSAGES/hello.mo
   /usr/share/locale/id/LC_MESSAGES/hello.mo
   /usr/share/locale/it/LC_MESSAGES/hello.mo
   /usr/share/locale/ja/LC_MESSAGES/hello.mo
   /usr/share/locale/ka/LC_MESSAGES/hello.mo
   /usr/share/locale/ko/LC_MESSAGES/hello.mo
   /usr/share/locale/lv/LC_MESSAGES/hello.mo
   /usr/share/locale/ms/LC_MESSAGES/hello.mo
   /usr/share/locale/nb/LC_MESSAGES/hello.mo
   /usr/share/locale/nl/LC_MESSAGES/hello.mo
   /usr/share/locale/nn/LC_MESSAGES/hello.mo
   /usr/share/locale/pl/LC_MESSAGES/hello.mo
   /usr/share/locale/pt/LC_MESSAGES/hello.mo
   /usr/share/locale/pt_BR/LC_MESSAGES/hello.mo
   /usr/share/locale/ro/LC_MESSAGES/hello.mo
   /usr/share/locale/ru/LC_MESSAGES/hello.mo
   /usr/share/locale/sk/LC_MESSAGES/hello.mo
   /usr/share/locale/sl/LC_MESSAGES/hello.mo
   /usr/share/locale/sr/LC_MESSAGES/hello.mo
   /usr/share/locale/sv/LC_MESSAGES/hello.mo
   /usr/share/locale/th/LC_MESSAGES/hello.mo
   /usr/share/locale/tr/LC_MESSAGES/hello.mo
   /usr/share/locale/uk/LC_MESSAGES/hello.mo
   /usr/share/locale/vi/LC_MESSAGES/hello.mo
   /usr/share/locale/zh_CN/LC_MESSAGES/hello.mo
   /usr/share/locale/zh_TW/LC_MESSAGES/hello.mo
   /usr/share/man/man1/hello.1.gz

For ``/usr/bin/hello``, we can point to it with ``%{_bindir}/hello``. And for 
``/usr/share/info/hello.info.gz`` and ``/usr/share/man/man1/hello.1.gz``, we can
point to them with ``%{_datadir}/info/hello.info.gz`` and
``%{_datadir}/man/man1/hello.1.gz``.

Adding these to the files section looks like this:

.. code-block:: spec

   %files
   %{_bindir}/hello
   %{_datadir}/info/hello.info.gz
   %{_datadir}/man/man1/hello.1.gz

However, that still leaves all the files in ``/usr/share/locale``. For these,
we can use a wildcard. Notice how the only that changes is the language
code in the path. Everything else remains the same. So, we can write that as
``%{_datadir}/locale/*/LC_MESSAGES/hello.mo``. Add that to the end of your
``%files`` section.

Building the Spec
=================

If you've been following the tutorial up to this point, your specfile should
result in a package being built successfully now. To test, run ``rpmbuild -ba
hello.spec``. Your completed specfile should look like this:

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

Finishing Touches
=================

Packages should have their history documented, and that's what the ``%changelog``
section does. Changelog entries look like this:

.. code-block:: spec

   %changelog
   * Wed Dec 18 2019 Firstname Lastname <email.com> 2.10-1
   - Initial packaging for distro

.. container:: opensuse

   .. container:: caption

      :ogreen:`Note for openSUSE:` |br|
      openSUSE uses a special .changes file in its tooling. Covering
      this is outside of the scope of this tutorial, however. See
      relevant openSUSE documentation for how to do changelogs in
      openSUSE.

|br|

You can add one to your specfile, making it look like this: 

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

Notes
=====

This tutorial does not cover everything one would use for a package like this,
i.e. subpackages. The language files would be split out into a language
subpackage in most distros.

.. container:: flex

   .. figure:: /img/indepth-icon.png
      :target: indepth.html
      :figclass: related-link
      
      :nimi:`In-Depth Packaging` |br|
      Learn more complex tricks to take your
      package from basic to advanced.