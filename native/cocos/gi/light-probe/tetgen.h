//============================================================================//
//                                                                            //
// TetGen                                                                     //
//                                                                            //
// A Quality Tetrahedral Mesh Generator and A 3D Delaunay Triangulator        //
//                                                                            //
// Version 1.6.0                                                              //
// August 31, 2020                                                            //
//                                                                            //
// Copyright (C) 2002--2020                                                   //
//                                                                            //
// Hang Si                                                                    //
// Research Group: Numerical Mathematics and Scientific Computing             //
// Weierstrass Institute for Applied Analysis and Stochastics (WIAS)          //
// Mohrenstr. 39, 10117 Berlin, Germany                                       //
// si@wias-berlin.de                                                          //
//                                                                            //
// TetGen is a tetrahedral mesh generator. It creates 3d triangulations of    //
//   polyhedral domains. It generates meshes with well-shaped elements whose  //
//   sizes are adapted to the geometric features or user-provided sizing      //
//   functions. It has applications in various applications in scientific     //
//   computing, such as computer graphics (CG), computer-aided design (CAD),  //
//   geometry processing (parametrizations and computer animation), and       //
//   physical simulations (finite element analysis).                          //
//                                                                            //
// TetGen computes (weighted) Delaunay triangulations for three-dimensional   //
//   (weighted) point sets, and constrained Delaunay triangulations for       //
//   three-dimensional polyhedral domains. In the latter case, input edges    //
//   and triangles can be completely preserved in the output meshes.  TetGen  //
//   can refine or coarsen an existing mesh to result in good quality and     //
//   size-adapted mesh according to the geometric features and user-defined   //
//   mesh sizing functions.                                                   //
//                                                                            //
// TetGen implements theoretically proven algorithms for computing the        //
//   Delaunay and constrained Delaunay tetrahedralizations. TetGen achieves   //
//   robustness and efficiency by using advanced techniques in computational  //
//   geometry. A technical paper describes the algorithms and methods         //
//   implemented in TetGen is available in ACM-TOMS, Hang Si ``TetGen, a      //
//   Delaunay-Based Quality Tetrahedral Mesh Generator", ACM Transactions on  //
//   Mathematical Software, February 2015, https://doi.org/10.1145/2629697.   //
//                                                                            //
// TetGen is freely available through the website: http://www.tetgen.org.     //
//   It may be copied, modified, and redistributed for non-commercial use.    //
//   Please consult the file LICENSE for the detailed copyright notices.      //
//                                                                            //
//============================================================================//


#ifndef tetgenH
#define tetgenH

// To compile TetGen as a library instead of an executable program, define
//   the TETLIBRARY symbol.

// #define TETLIBRARY


// TetGen default uses the double-precision (64 bit) for a real number.
//   Alternatively, one can use the single-precision (32 bit) 'float' if the
//   memory is limited.

#define REAL double  // #define REAL float

// The maximum number of characters in a file name (including the null).

#define FILENAMESIZE 1024

// The maximum number of chars in a line read from a file (including the null).

#define INPUTLINESIZE 2048

// C standard libraries to perform Input/output operations, general utililities,
//   manipulate strings and arrays, compute common mathematical operations,
//   get date and time information.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>

// The types 'intptr_t' and 'uintptr_t' are signed and unsigned integer types,
//   respectively. They are guaranteed to be the same width as a pointer.
//   They are defined in <stdint.h> by the C99 Standard.

#include <stdint.h>

//============================================================================//
//                                                                            //
// tetgenio                                                                   //
//                                                                            //
// A structure for transferring input/output data between the user and        //
//   TetGen's internal data structure (class tetgenmesh).                     //
//                                                                            //
// This data structure contains a collection of arrays, i.e., points, facets, //
//   tetrahedra. It contains functions to read input data from files (.node,  //
//   .poly, .face, .edge, .ele) as well as write output data into files.      //
//                                                                            //
// Once an object of tetgenio is declared,  no array is created. One has to   //
//   allocate enough memory for them. On the deletion of this object, the     //
//   memory occupied by these arrays needs to be freed.  The routine          //
//   deinitialize() will be automatically called.  It frees the memory for    //
//   an array if it is not a NULL.  Note that it assumes that the memory is   //
//   allocated by the C++ "new" operator. Otherwise, the user is responsible  //
//   to free them and all pointers must be NULL.                              //
//                                                                            //
//============================================================================//

class tetgenio {

public:

  // A "polygon" describes a simple polygon (no holes). It is not necessarily
  //   convex. Each polygon contains a number of corners (points) and the same
  //   number of sides (edges).  The points of the polygon must be given in
  //   either counterclockwise or clockwise order and they form a ring, so 
  //   every two consecutive points forms an edge of the polygon.
  typedef struct {
    int *vertexlist;
    int numberofvertices;
  } polygon;

  // A "facet" describes a polygonal region possibly with holes, edges, and 
  //   points floating in it.  Each facet consists of a list of polygons and
  //   a list of hole points (which lie strictly inside holes).
  typedef struct {
    polygon *polygonlist;
    int numberofpolygons;
    REAL *holelist;
    int numberofholes;
  } facet;

  // A "voroedge" is an edge of the Voronoi diagram. It corresponds to a
  //   Delaunay face.  Each voroedge is either a line segment connecting
  //   two Voronoi vertices or a ray starting from a Voronoi vertex to an
  //   "infinite vertex".  'v1' and 'v2' are two indices pointing to the
  //   list of Voronoi vertices. 'v1' must be non-negative, while 'v2' may
  //   be -1 if it is a ray, in this case, the unit normal of this ray is
  //   given in 'vnormal'. 
  typedef struct {
    int v1, v2;
    REAL vnormal[3];
  } voroedge;

  // A "vorofacet" is an facet of the Voronoi diagram. It corresponds to a
  //   Delaunay edge.  Each Voronoi facet is a convex polygon formed by a
  //   list of Voronoi edges, it may not be closed.  'c1' and 'c2' are two
  //   indices pointing into the list of Voronoi cells, i.e., the two cells
  //   share this facet.  'elist' is an array of indices pointing into the
  //   list of Voronoi edges, 'elist[0]' saves the number of Voronoi edges
  //   (including rays) of this facet.
  typedef struct {
    int c1, c2;
    int *elist;
  } vorofacet;


  // Additional parameters associated with an input (or mesh) vertex.
  //   These informations are provided by CAD libraries. 
  typedef struct {
    REAL uv[2];
    int tag;
    int type; // 0, 1, or 2.
  } pointparam;

  // Callback functions for meshing PSCs.
  typedef REAL (* GetVertexParamOnEdge)(void*, int, int);
  typedef void (* GetSteinerOnEdge)(void*, int, REAL, REAL*);
  typedef void (* GetVertexParamOnFace)(void*, int, int, REAL*);
  typedef void (* GetEdgeSteinerParamOnFace)(void*, int, REAL, int, REAL*);
  typedef void (* GetSteinerOnFace)(void*, int, REAL*, REAL*);

  // A callback function for mesh refinement.
  typedef bool (* TetSizeFunc)(REAL*, REAL*, REAL*, REAL*, REAL*, REAL);

  // Items are numbered starting from 'firstnumber' (0 or 1), default is 0.
  int firstnumber; 

  // Dimension of the mesh (2 or 3), default is 3.
  int mesh_dim;

  // Does the lines in .node file contain index or not, default is 1.
  int useindex;

  // 'pointlist':  An array of point coordinates.  The first point's x
  //   coordinate is at index [0] and its y coordinate at index [1], its
  //   z coordinate is at index [2], followed by the coordinates of the
  //   remaining points.  Each point occupies three REALs. 
  // 'pointattributelist':  An array of point attributes.  Each point's
  //   attributes occupy 'numberofpointattributes' REALs.
  // 'pointmtrlist': An array of metric tensors at points. Each point's
  //   tensor occupies 'numberofpointmtr' REALs.
  // 'pointmarkerlist':  An array of point markers; one integer per point.
  // 'point2tetlist': An array of tetrahedra indices; one integer per point.
  REAL *pointlist;
  REAL *pointattributelist;
  REAL *pointmtrlist;
  int  *pointmarkerlist;
  int  *point2tetlist;
  pointparam *pointparamlist;
  int numberofpoints;
  int numberofpointattributes;
  int numberofpointmtrs;
 
  // 'tetrahedronlist':  An array of tetrahedron corners.  The first 
  //   tetrahedron's first corner is at index [0], followed by its other 
  //   corners, followed by six nodes on the edges of the tetrahedron if the
  //   second order option (-o2) is applied. Each tetrahedron occupies
  //   'numberofcorners' ints.  The second order nodes are ouput only. 
  // 'tetrahedronattributelist':  An array of tetrahedron attributes.  Each
  //   tetrahedron's attributes occupy 'numberoftetrahedronattributes' REALs.
  // 'tetrahedronvolumelist':  An array of constraints, i.e. tetrahedron's
  //   volume; one REAL per element.  Input only.
  // 'neighborlist':  An array of tetrahedron neighbors; 4 ints per element. 
  // 'tet2facelist':  An array of tetrahedron face indices; 4 ints per element.
  // 'tet2edgelist':  An array of tetrahedron edge indices; 6 ints per element.
  int  *tetrahedronlist;
  REAL *tetrahedronattributelist;
  REAL *tetrahedronvolumelist;
  int  *neighborlist;
  int  *tet2facelist;
  int  *tet2edgelist;
  int numberoftetrahedra;
  int numberofcorners;
  int numberoftetrahedronattributes;

  // 'facetlist':  An array of facets.  Each entry is a structure of facet.
  // 'facetmarkerlist':  An array of facet markers; one int per facet.
  facet *facetlist;
  int *facetmarkerlist;
  int numberoffacets;

  // 'holelist':  An array of holes (in volume).  Each hole is given by a
  //   seed (point) which lies strictly inside it. The first seed's x, y and z
  //   coordinates are at indices [0], [1] and [2], followed by the
  //   remaining seeds.  Three REALs per hole. 
  REAL *holelist;
  int numberofholes;

  // 'regionlist': An array of regions (subdomains).  Each region is given by
  //   a seed (point) which lies strictly inside it. The first seed's x, y and
  //   z coordinates are at indices [0], [1] and [2], followed by the regional
  //   attribute at index [3], followed by the maximum volume at index [4]. 
  //   Five REALs per region.
  // Note that each regional attribute is used only if you select the 'A'
  //   switch, and each volume constraint is used only if you select the
  //   'a' switch (with no number following).
  REAL *regionlist;
  int numberofregions;

  // 'refine_elem_list': An array of tetrahedra to be refined.  The first 
  //   tetrahedron's first corner is at index [0], followed by its other 
  //   corners. Four integers per element.
  // 'refine_elem_vol_list':  An array of constraints, i.e. tetrahedron's
  //   volume; one REAL per element.
  int  *refine_elem_list;
  REAL *refine_elem_vol_list;
  int  numberofrefineelems;

  // 'facetconstraintlist':  An array of facet constraints.  Each constraint
  //   specifies a maximum area bound on the subfaces of that facet.  The
  //   first facet constraint is given by a facet marker at index [0] and its
  //   maximum area bound at index [1], followed by the remaining facet con-
  //   straints. Two REALs per facet constraint.  Note: the facet marker is
  //   actually an integer.
  REAL *facetconstraintlist;
  int numberoffacetconstraints;

  // 'segmentconstraintlist': An array of segment constraints. Each constraint 
  //   specifies a maximum length bound on the subsegments of that segment.
  //   The first constraint is given by the two endpoints of the segment at
  //   index [0] and [1], and the maximum length bound at index [2], followed
  //   by the remaining segment constraints.  Three REALs per constraint. 
  //   Note the segment endpoints are actually integers.
  REAL *segmentconstraintlist;
  int numberofsegmentconstraints;


  // 'trifacelist':  An array of face (triangle) corners.  The first face's
  //   three corners are at indices [0], [1] and [2], followed by the remaining
  //   faces.  Three ints per face.
  // 'trifacemarkerlist':  An array of face markers; one int per face.
  // 'o2facelist':  An array of second order nodes (on the edges) of the face.
  //   It is output only if the second order option (-o2) is applied. The
  //   first face's three second order nodes are at [0], [1], and [2],
  //   followed by the remaining faces.  Three ints per face.
  // 'face2tetlist':  An array of tetrahedra indices; 2 ints per face.
  // 'face2edgelist':  An array of edge indices; 3 ints per face.
  int *trifacelist;
  int *trifacemarkerlist;
  int *o2facelist;
  int *face2tetlist;
  int *face2edgelist;
  int numberoftrifaces;

  // 'edgelist':  An array of edge endpoints.  The first edge's endpoints
  //   are at indices [0] and [1], followed by the remaining edges.
  //   Two ints per edge.
  // 'edgemarkerlist':  An array of edge markers; one int per edge.
  // 'o2edgelist':  An array of midpoints of edges. It is output only if the
  //   second order option (-o2) is applied. One int per edge.
  // 'edge2tetlist':  An array of tetrahedra indices.  One int per edge.
  int *edgelist;
  int *edgemarkerlist;
  int *o2edgelist;
  int *edge2tetlist;
  int numberofedges;

  // 'vpointlist':  An array of Voronoi vertex coordinates (like pointlist).
  // 'vedgelist':  An array of Voronoi edges.  Each entry is a 'voroedge'.
  // 'vfacetlist':  An array of Voronoi facets. Each entry is a 'vorofacet'.
  // 'vcelllist':  An array of Voronoi cells.  Each entry is an array of
  //   indices pointing into 'vfacetlist'. The 0th entry is used to store
  //   the length of this array.
  REAL *vpointlist;
  voroedge *vedgelist;
  vorofacet *vfacetlist;
  int **vcelllist;
  int numberofvpoints;
  int numberofvedges;
  int numberofvfacets;
  int numberofvcells;


  // Variable (and callback functions) for meshing PSCs.
  void *geomhandle;
  GetVertexParamOnEdge getvertexparamonedge;
  GetSteinerOnEdge getsteineronedge;
  GetVertexParamOnFace getvertexparamonface;
  GetEdgeSteinerParamOnFace getedgesteinerparamonface;
  GetSteinerOnFace getsteineronface;

  // A callback function.
  TetSizeFunc tetunsuitable;

  // Input & output routines.
  bool load_node_call(FILE* infile, int markers, int uvflag, char*);
  bool load_node(char*);
  bool load_edge(char*);
  bool load_face(char*);
  bool load_tet(char*);
  bool load_vol(char*);
  bool load_var(char*);
  bool load_mtr(char*);
  bool load_elem(char*);
  bool load_poly(char*);
  bool load_off(char*);
  bool load_ply(char*);
  bool load_stl(char*);
  bool load_vtk(char*);
  bool load_medit(char*, int);
  bool load_neumesh(char*, int);
  bool load_plc(char*, int);
  bool load_tetmesh(char*, int);
  void save_nodes(const char*);
  void save_elements(const char*);
  void save_faces(const char*);
  void save_edges(char*);
  void save_neighbors(char*);
  void save_poly(const char*);
  void save_faces2smesh(char*);

  // Read line and parse string functions.
  char *readline(char* string, FILE* infile, int *linenumber);
  char *findnextfield(char* string);
  char *readnumberline(char* string, FILE* infile, char* infilename);
  char *findnextnumber(char* string);

  static void init(polygon* p) {
    p->vertexlist = (int *) NULL;
    p->numberofvertices = 0;
  }

  static void init(facet* f) {
    f->polygonlist = (polygon *) NULL;
    f->numberofpolygons = 0;
    f->holelist = (REAL *) NULL;
    f->numberofholes = 0;
  }

  // Initialize routine.
  void initialize()
  {
    firstnumber = 0;
    mesh_dim = 3;
    useindex = 1;

    pointlist = (REAL *) NULL;
    pointattributelist = (REAL *) NULL;
    pointmtrlist = (REAL *) NULL;
    pointmarkerlist = (int *) NULL;
	point2tetlist = (int *) NULL;
    pointparamlist = (pointparam *) NULL;
    numberofpoints = 0;
    numberofpointattributes = 0;
    numberofpointmtrs = 0;

    tetrahedronlist = (int *) NULL;
    tetrahedronattributelist = (REAL *) NULL;
    tetrahedronvolumelist = (REAL *) NULL;
    neighborlist = (int *) NULL;
	tet2facelist = (int *) NULL;
	tet2edgelist = (int *) NULL;
    numberoftetrahedra = 0;
    numberofcorners = 4; 
    numberoftetrahedronattributes = 0;

    trifacelist = (int *) NULL;
    trifacemarkerlist = (int *) NULL;
    o2facelist = (int *) NULL;
    face2tetlist = (int *) NULL;
	face2edgelist = (int *) NULL;
    numberoftrifaces = 0; 

    edgelist = (int *) NULL;
    edgemarkerlist = (int *) NULL;
    o2edgelist = (int *) NULL;
    edge2tetlist = (int *) NULL;
    numberofedges = 0;

    facetlist = (facet *) NULL;
    facetmarkerlist = (int *) NULL;
    numberoffacets = 0; 

    holelist = (REAL *) NULL;
    numberofholes = 0;

    regionlist = (REAL *) NULL;
    numberofregions = 0;

    refine_elem_list = (int *) NULL;
    refine_elem_vol_list = (REAL *) NULL;
    numberofrefineelems = 0;

    facetconstraintlist = (REAL *) NULL;
    numberoffacetconstraints = 0;
    segmentconstraintlist = (REAL *) NULL;
    numberofsegmentconstraints = 0;


    vpointlist = (REAL *) NULL;
    vedgelist = (voroedge *) NULL;
    vfacetlist = (vorofacet *) NULL; 
    vcelllist = (int **) NULL; 
    numberofvpoints = 0;
    numberofvedges = 0;
    numberofvfacets = 0;
    numberofvcells = 0;


    tetunsuitable = NULL;

    geomhandle = NULL;
    getvertexparamonedge = NULL;
    getsteineronedge = NULL;
    getvertexparamonface = NULL;
    getedgesteinerparamonface = NULL;
    getsteineronface = NULL;
  }

  // Free the memory allocated in 'tetgenio'.  Note that it assumes that the 
  //   memory was allocated by the "new" operator (C++).
  void clean_memory()
  {
    int i, j;

    if (pointlist != (REAL *) NULL) {
      delete [] pointlist;
    }
    if (pointattributelist != (REAL *) NULL) {
      delete [] pointattributelist;
    }
    if (pointmtrlist != (REAL *) NULL) {
      delete [] pointmtrlist;
    }
    if (pointmarkerlist != (int *) NULL) {
      delete [] pointmarkerlist;
    }
	if (point2tetlist != (int *) NULL) {
      delete [] point2tetlist;
    }
    if (pointparamlist != (pointparam *) NULL) {
      delete [] pointparamlist;
    }

    if (tetrahedronlist != (int *) NULL) {
      delete [] tetrahedronlist;
    }
    if (tetrahedronattributelist != (REAL *) NULL) {
      delete [] tetrahedronattributelist;
    }
    if (tetrahedronvolumelist != (REAL *) NULL) {
      delete [] tetrahedronvolumelist;
    }
    if (neighborlist != (int *) NULL) {
      delete [] neighborlist;
    }
    if (tet2facelist != (int *) NULL) {
	  delete [] tet2facelist;
	}
	if (tet2edgelist != (int *) NULL) {
	  delete [] tet2edgelist;
	}

    if (trifacelist != (int *) NULL) {
      delete [] trifacelist;
    }
    if (trifacemarkerlist != (int *) NULL) {
      delete [] trifacemarkerlist;
    }
    if (o2facelist != (int *) NULL) {
      delete [] o2facelist;
    }
    if (face2tetlist != (int *) NULL) {
      delete [] face2tetlist;
    }
	if (face2edgelist != (int *) NULL) {
      delete [] face2edgelist;
    }

    if (edgelist != (int *) NULL) {
      delete [] edgelist;
    }
    if (edgemarkerlist != (int *) NULL) {
      delete [] edgemarkerlist;
    }
    if (o2edgelist != (int *) NULL) {
      delete [] o2edgelist;
    }
    if (edge2tetlist != (int *) NULL) {
      delete [] edge2tetlist;
    }

    if (facetlist != (facet *) NULL) {
      facet *f;
      polygon *p;
      for (i = 0; i < numberoffacets; i++) {
        f = &facetlist[i];
        for (j = 0; j < f->numberofpolygons; j++) {
          p = &f->polygonlist[j];
          delete [] p->vertexlist;
        }
        delete [] f->polygonlist;
        if (f->holelist != (REAL *) NULL) {
          delete [] f->holelist;
        }
      }
      delete [] facetlist;
    }
    if (facetmarkerlist != (int *) NULL) {
      delete [] facetmarkerlist;
    }

    if (holelist != (REAL *) NULL) {
      delete [] holelist;
    }
    if (regionlist != (REAL *) NULL) {
      delete [] regionlist;
    }
    if (refine_elem_list != (int *) NULL) {
      delete [] refine_elem_list;
      if (refine_elem_vol_list != (REAL *) NULL) {
        delete [] refine_elem_vol_list;
      }
    }
    if (facetconstraintlist != (REAL *) NULL) {
      delete [] facetconstraintlist;
    }
    if (segmentconstraintlist != (REAL *) NULL) {
      delete [] segmentconstraintlist;
    }
    if (vpointlist != (REAL *) NULL) {
      delete [] vpointlist;
    }
    if (vedgelist != (voroedge *) NULL) {
      delete [] vedgelist;
    }
    if (vfacetlist != (vorofacet *) NULL) {
      for (i = 0; i < numberofvfacets; i++) {
        delete [] vfacetlist[i].elist;
      }
      delete [] vfacetlist;
    }
    if (vcelllist != (int **) NULL) {
      for (i = 0; i < numberofvcells; i++) {
        delete [] vcelllist[i];
      }
      delete [] vcelllist;
    }
  }

  // Constructor & destructor.
  tetgenio() {initialize();}
  ~tetgenio() {clean_memory();}

}; // class tetgenio

//============================================================================//
//                                                                            //
// tetgenbehavior                                                             //
//                                                                            //
// A structure for maintaining the switches and parameters used by TetGen's   //
// internal data structure and algorithms.                                    //
//                                                                            //
// All switches and parameters are initialized with default values. They are  //
// set by the command line arguments (argc, argv).                            //
//                                                                            //
// NOTE: Some switches are incompatible with others. While some may depend    //
// on other switches. The routine parse_commandline() sets the switches from  //
// the command line (a list of strings) and checks the consistency of the     //
// applied switches.                                                          //
//                                                                            //
//============================================================================//

class tetgenbehavior {

public:

  // Switches of TetGen. 
  int plc;                                                         // '-p', 0.
  int psc;                                                         // '-s', 0.
  int refine;                                                      // '-r', 0.
  int quality;                                                     // '-q', 0.
  int nobisect;                                                    // '-Y', 0.
  int cdt;                                                         // '-D', 0.
  int cdtrefine;                                                  // '-D#', 7.
  int coarsen;                                                     // '-R', 0.
  int weighted;                                                    // '-w', 0.
  int brio_hilbert;                                                // '-b', 1.
  int flipinsert;                                                  // '-L', 0.
  int metric;                                                      // '-m', 0.
  int varvolume;                                                   // '-a', 0.
  int fixedvolume;                                                 // '-a', 0.
  int regionattrib;                                                // '-A', 0.
  int insertaddpoints;                                             // '-i', 0.
  int diagnose;                                                    // '-d', 0.
  int convex;                                                      // '-c', 0.
  int nomergefacet;                                                // '-M', 0.
  int nomergevertex;                                               // '-M', 0.
  int noexact;                                                     // '-X', 0.
  int nostaticfilter;                                              // '-X', 0.
  int zeroindex;                                                   // '-z', 0.
  int facesout;                                                    // '-f', 0.
  int edgesout;                                                    // '-e', 0.
  int neighout;                                                    // '-n', 0.
  int voroout;                                                     // '-v', 0.
  int meditview;                                                   // '-g', 0.
  int vtkview;                                                     // '-k', 0.
  int vtksurfview;                                                 // '-k', 0.
  int nobound;                                                     // '-B', 0.
  int nonodewritten;                                               // '-N', 0.
  int noelewritten;                                                // '-E', 0.
  int nofacewritten;                                               // '-F', 0.
  int noiterationnum;                                              // '-I', 0.
  int nojettison;                                                  // '-J', 0.
  int docheck;                                                     // '-C', 0.
  int quiet;                                                       // '-Q', 0.
  int nowarning;                                                   // '-W', 0.
  int verbose;                                                     // '-V', 0.

  // Parameters of TetGen.
  int vertexperblock;                                           // '-x', 4092.
  int tetrahedraperblock;                                       // '-x', 8188.
  int shellfaceperblock;                                        // '-x', 2044.
  int supsteiner_level;                                           // '-Y/', 2.
  int addsteiner_algo;                                           // '-Y//', 1.
  int coarsen_param;                                               // '-R', 0.
  int weighted_param;                                              // '-w', 0.
  int fliplinklevel;                                                    // -1.
  int flipstarsize;                                                     // -1.
  int fliplinklevelinc;                                                 //  1.
  int opt_max_flip_level;                                          // '-O', 3.
  int opt_scheme;                                                // '-O/#', 7.
  int opt_iterations;                                             // -O//#, 3.
  int smooth_cirterion;                                              // -s, 1.
  int smooth_maxiter;                                                // -s, 7.
  int delmaxfliplevel;                                                   // 1.
  int order;                                                       // '-o', 1.
  int reversetetori;                                              // '-o/', 0.
  int steinerleft;                                                 // '-S', 0.
  int unflip_queue_limit;                                      // '-U#', 1000.
  int no_sort;                                                           // 0.
  int hilbert_order;                                           // '-b///', 52.
  int hilbert_limit;                                             // '-b//'  8.
  int brio_threshold;                                              // '-b' 64.
  REAL brio_ratio;                                             // '-b/' 0.125.
  REAL epsilon;                                               // '-T', 1.0e-8.
  REAL facet_separate_ang_tol;                                 // '-p', 179.9.
  REAL collinear_ang_tol;                                     // '-p/', 179.9.
  REAL facet_small_ang_tol;                                   // '-p//', 15.0.
  REAL maxvolume;                                               // '-a', -1.0.
  REAL maxvolume_length;                                        // '-a', -1.0.
  REAL minratio;                                                 // '-q', 0.0.
  REAL opt_max_asp_ratio;                                           // 1000.0.
  REAL opt_max_edge_ratio;                                           // 100.0.
  REAL mindihedral;                                              // '-q', 5.0.
  REAL optmaxdihedral;                                          // -o/# 177.0.
  REAL metric_scale;                                              // -m#, 1.0.
  REAL smooth_alpha;                                             // '-s', 0.3.
  REAL coarsen_percent;                                         // -R1/#, 1.0.
  REAL elem_growth_ratio;             // Growth ratio of # elements, -r#, 0.0.
  REAL refine_progress_ratio;                                   // -r/#, 0.333.

  // Strings of command line arguments and input/output file names.
  char commandline[1024];
  char infilename[1024];
  char outfilename[1024];
  char addinfilename[1024];
  char bgmeshfilename[1024];

  // Read an additional tetrahedral mesh and treat it as holes [2018-07-30].
  int hole_mesh;                                                   // '-H', 0.
  char hole_mesh_filename[1024];

  // The input object of TetGen. They are recognized by either the input 
  //   file extensions or by the specified options. 
  // Currently the following objects are supported:
  //   - NODES, a list of nodes (.node); 
  //   - POLY, a piecewise linear complex (.poly or .smesh); 
  //   - OFF, a polyhedron (.off, Geomview's file format); 
  //   - PLY, a polyhedron (.ply, file format from gatech, only ASCII);
  //   - STL, a surface mesh (.stl, stereolithography format);
  //   - MEDIT, a surface mesh (.mesh, Medit's file format); 
  //   - MESH, a tetrahedral mesh (.ele).
  // If no extension is available, the imposed command line switch
  //   (-p or -r) implies the object. 
  enum objecttype {NODES, POLY, OFF, PLY, STL, MEDIT, VTK, MESH, NEU_MESH} object;


  void syntax();
  void usage();

  // Command line parse routine.
  bool parse_commandline(int argc, char **argv);
  bool parse_commandline(char *switches) {
    return parse_commandline(0, &switches);
  }

  // Initialize all variables.
  tetgenbehavior()
  {
    plc = 0;
    psc = 0;
    refine = 0;
    quality = 0;
    nobisect = 0;
    cdt = 0; // set by -D (without a number following it)
    cdtrefine = 7; // default, set by -D#
    coarsen = 0;
    metric = 0;
    weighted = 0;
    brio_hilbert = 1;
    flipinsert = 0;
    varvolume = 0;
    fixedvolume = 0;
    noexact = 0;
    nostaticfilter = 0;
    insertaddpoints = 0;
    regionattrib = 0;
    diagnose = 0;
    convex = 0;
    zeroindex = 0;
    facesout = 0;
    edgesout = 0;
    neighout = 0;
    voroout = 0;
    meditview = 0;
    vtkview = 0;
    vtksurfview = 0;
    nobound = 0;
    nonodewritten = 0;
    noelewritten = 0;
    nofacewritten = 0;
    noiterationnum = 0;
    nomergefacet = 0;
    nomergevertex = 0;
    nojettison = 0;
    docheck = 0;
    quiet = 0;
    nowarning = 0;
    verbose = 0;

    vertexperblock = 4092;
    tetrahedraperblock = 8188;
    shellfaceperblock = 4092;
    supsteiner_level = 2;
    addsteiner_algo = 1;
    coarsen_param = 0;
    weighted_param = 0;
    fliplinklevel = -1; 
    flipstarsize = -1;  
    fliplinklevelinc = 1;
    opt_scheme = 7;
    opt_max_flip_level = 3;
    opt_iterations = 3;
    delmaxfliplevel = 1;
    order = 1;
    reversetetori = 0;
    steinerleft = -1;
    unflip_queue_limit = 1000;
    no_sort = 0;
    hilbert_order = 52; //-1;
    hilbert_limit = 8;
    brio_threshold = 64;
    brio_ratio = 0.125;
    facet_separate_ang_tol = 179.9;
    collinear_ang_tol = 179.9;
    facet_small_ang_tol = 15.0;
    maxvolume = -1.0;
    maxvolume_length = -1.0;
    minratio = 2.0;
    opt_max_asp_ratio = 1000.;
    opt_max_edge_ratio = 100.;
    mindihedral = 3.5;
    optmaxdihedral = 177.00;
    epsilon = 1.0e-8;
    coarsen_percent = 1.0;
    metric_scale = 1.0; // -m#
    elem_growth_ratio = 0.0; // -r#
    refine_progress_ratio = 0.333; // -r/#
    object = NODES;
    
    smooth_cirterion = 3; // -s# default smooth surface and volume vertices.
    smooth_maxiter = 7;   // set by -s#/7
    smooth_alpha = 0.3;   // relax parameter, set by -s#/#/0.3

    commandline[0] = '\0';
    infilename[0] = '\0';
    outfilename[0] = '\0';
    addinfilename[0] = '\0';
    bgmeshfilename[0] = '\0';

    hole_mesh = 0;
    hole_mesh_filename[0] = '\0';

  }

}; // class tetgenbehavior

//============================================================================//
//                                                                            //
// Robust Geometric predicates                                                //
//                                                                            //
// The following routines are the robust geometric predicates for orientation //
// test and point-in-sphere test implemented by Jonathan Shewchuk.            //
// He generously provided the source code in the public domain,               //
// http://www.cs.cmu.edu/~quake/robust.html.                                  //
// predicates.cxx is a C++ version of the original C code.                    //
//                                                                            //
// The original predicates of Shewchuk only use "dynamic filters", i.e., it   //
// computes the error at runtime step by step. TetGen first uses a "static    //
// filter" in each predicate. It estimates the maximal possible error in all  //
// cases.  It safely and quickly "filters" many easy cases.                   //
//                                                                            //
//============================================================================//

void exactinit(int, int, int, REAL, REAL, REAL);

REAL orient3d(REAL *pa, REAL *pb, REAL *pc, REAL *pd);
REAL insphere(REAL *pa, REAL *pb, REAL *pc, REAL *pd, REAL *pe);
REAL orient4d(REAL *pa, REAL *pb, REAL *pc, REAL *pd, REAL *pe,
              REAL ah, REAL bh, REAL ch, REAL dh, REAL eh);

REAL orient2dexact(REAL *pa, REAL *pb, REAL *pc);
REAL orient3dexact(REAL *pa, REAL *pb, REAL *pc, REAL *pd);
REAL orient4dexact(REAL* pa, REAL* pb, REAL* pc, REAL* pd, REAL* pe,
                   REAL ah, REAL bh, REAL ch, REAL dh, REAL eh);


//============================================================================//
//                                                                            //
// tetgenmesh    TetGen's internal mesh data structure.                       //
//                                                                            //
// It uses a tetrahedron-based mesh data structure. It implements elementary  //
// flip operations to locally modify the mesh. It implements basic meshing    //
// algorithms to create Delaunay tetrahedraliations, to perform boundary      //
// recovery, to place Steiner points in the mesh domain, and to optimize the  //
// quality of the mesh.                                                       //
//                                                                            //
//============================================================================//

class tetgenmesh {

public:

//============================================================================//
//                                                                            //
// Mesh data structure                                                        //
//                                                                            //
// A tetrahedral mesh T of a 3D piecewise linear complex (PLC) X is a 3D      //
// simplicial complex whose underlying space is equal to the space of X.  T   //
// contains a 2D subcomplex S which is a triangular mesh of the boundary of   //
// X. S contains a 1D subcomplex L which is a linear mesh of the boundary of  //
// S. Faces and edges in S and L are respectively called subfaces and segme-  //
// nts to distinguish them from others in T.                                  //
//                                                                            //
// TetGen uses a tetrahedron-based data structure.  It stores tetrahedra and  //
// vertices.  This data structure is pointer-based. Each tetrahedron contains //
// pointers to its vertices and adjacent tetrahedra. Each vertex holds its x-,//
// y-, z-coordinates, and a pointer to one of the tetrahedra having it.  Both //
// tetrahedra and vertices may contain user data.                             //
//                                                                            //
// Let T be a tetrahedralization. Each triangular face of T belongs to either //
// two or one tetrahedron.  In the latter case, it is an exterior boundary    //
// face of T. TetGen attaches tetrahedra (one-to-one) to such faces. All such //
// tetrahedra contain an "infinite vertex" (which has no geometric coordinates//
// ).  One can imagine such a vertex lies in 4D space and is visible by all   //
// exterior boundary faces simultaneously.  This extended set of tetrahedra   //
// (including the infinite vertex) becomes a tetrahedralization of a 3-sphere //
// that has no boundary in 3d. It has the nice property that every triangular //
// face is shared by exactly two tetrahedra.                                  //
//                                                                            //
// The current version of TetGen stores explicitly the subfaces and segments  //
// (which are in surface mesh S and the linear mesh L), respectively.  Extra  //
// pointers are allocated in tetrahedra and subfaces to point each other.     //
//                                                                            //
//============================================================================//

  // The tetrahedron data structure.  It includes the following fields:
  //   - a list of four adjoining tetrahedra;
  //   - a list of four vertices;
  //   - a pointer to a list of four subfaces (optional, for -p switch);
  //   - a pointer to a list of six segments  (optional, for -p switch);
  //   - a list of user-defined floating-point attributes (optional);
  //   - a volume constraint (optional, for -a switch);
  //   - an integer of element marker (and flags);
  // The structure of a tetrahedron is an array of pointers.  Its actual size
  //   (the length of the array) is determined at runtime.

  typedef REAL **tetrahedron;

  // The subface data structure.  It includes the following fields:
  //   - a list of three adjoining subfaces;
  //   - a list of three vertices;
  //   - a list of three adjoining segments;
  //   - two adjoining tetrahedra;
  //   - an area constraint (optional, for -q switch);
  //   - an integer for boundary marker;
  //   - an integer for type, flags, etc.

  typedef REAL **shellface;

  // The point data structure.  It includes the following fields:
  //   - x, y and z coordinates;
  //   - a list of user-defined point attributes (optional);
  //   - u, v coordinates (optional, for -s switch);
  //   - a metric tensor (optional, for -q or -m switch);
  //   - a pointer to an adjacent tetrahedron;
  //   - a pointer to a parent (or a duplicate) point;
  //   - a pointer to an adjacent subface or segment (optional, -p switch);
  //   - a pointer to a tet in background mesh (optional, for -m switch);
  //   - an integer for boundary marker (point index);
  //   - an integer for point type (and flags).
  //   - an integer for geometry tag (optional, for -s switch).
  // The structure of a point is an array of REALs.  Its acutal size is 
  //   determined at the runtime.

  typedef REAL *point;

//============================================================================//
//                                                                            //
// Handles                                                                    //
//                                                                            //
// Navigation and manipulation in a tetrahedralization are accomplished by    //
// operating on structures referred as ``handles". A handle is a pair (t,v),  //
// where t is a pointer to a tetrahedron, and v is a 4-bit integer, in the    //
// range from 0 to 11. v is called the ``version'' of a tetrahedron, it rep-  //
// resents a directed edge of a specific face of the tetrahedron.             //
//                                                                            //
// There are 12 even permutations of the four vertices, each of them corres-  //
// ponds to a directed edge (a version) of the tetrahedron.  The 12 versions  //
// can be grouped into 4 distinct ``edge rings'' in 4 ``oriented faces'' of   //
// this tetrahedron.  One can encode each version (a directed edge) into a    //
// 4-bit integer such that the two upper bits encode the index (from 0 to 2)  //
// of this edge in the edge ring, and the two lower bits encode the index (   //
// from 0 to 3) of the oriented face which contains this edge.                //
//                                                                            //
// The four vertices of a tetrahedron are indexed from 0 to 3 (according to   //
// their storage in the data structure).  Give each face the same index as    //
// the node opposite it in the tetrahedron.  Denote the edge connecting face  //
// i to face j as i/j. We number the twelve versions as follows:              //
//                                                                            //
//           |   edge 0     edge 1     edge 2                                 //
//   --------|--------------------------------                                //
//    face 0 |   0 (0/1)    4 (0/3)    8 (0/2)                                //
//    face 1 |   1 (1/2)    5 (1/3)    9 (1/0)                                //
//    face 2 |   2 (2/3)    6 (2/1)   10 (2/0)                                //
//    face 3 |   3 (3/0)    7 (3/1)   11 (3/2)                                //
//                                                                            //
// Similarly, navigation and manipulation in a (boundary) triangulation are   //
// done by using handles of triangles. Each handle is a pair (s, v), where s  //
// is a pointer to a triangle, and v is a version in the range from 0 to 5.   //
// Each version corresponds to a directed edge of this triangle.              //
//                                                                            //
// Number the three vertices of a triangle from 0 to 2 (according to their    //
// storage in the data structure). Give each edge the same index as the node  //
// opposite it in the triangle. The six versions of a triangle are:           //
//                                                                            //
//                 | edge 0   edge 1   edge 2                                 //
//  ---------------|--------------------------                                //
//   ccw orieation |   0        2        4                                    //
//    cw orieation |   1        3        5                                    //
//                                                                            //
// In the following, a 'triface' is a handle of tetrahedron, and a 'face' is  //
// a handle of a triangle.                                                    //
//                                                                            //
//============================================================================//

  class triface {
  public:
    tetrahedron *tet;
    int ver; // Range from 0 to 11.
    triface() : tet(0), ver(0) {}
    triface& operator=(const triface& t) {
      tet = t.tet; ver = t.ver;
      return *this;
    }
  };

  class face {
  public:
    shellface *sh;
    int shver; // Range from 0 to 5.
    face() : sh(0), shver(0) {}
    face& operator=(const face& s) {
      sh = s.sh; shver = s.shver;
      return *this;
    }
  };

//============================================================================//
//                                                                            //
// Arraypool                                                                  //
//                                                                            //
// A dynamic linear array. (It is written by J. Shewchuk)                     //
//                                                                            //
// Each arraypool contains an array of pointers to a number of blocks.  Each  //
// block contains the same fixed number of objects.  Each index of the array  //
// addresses a particular object in the pool. The most significant bits add-  //
// ress the index of the block containing the object. The less significant    //
// bits address this object within the block.                                 //
//                                                                            //
// 'objectbytes' is the size of one object in blocks; 'log2objectsperblock'   //
// is the base-2 logarithm of 'objectsperblock'; 'objects' counts the number  //
// of allocated objects; 'totalmemory' is the total memory in bytes.          //
//                                                                            //
//============================================================================//

  class arraypool {

  public:

    int objectbytes;
    int objectsperblock;
    int log2objectsperblock;
    int objectsperblockmark;
    int toparraylen;
    char **toparray;
    long objects;
    unsigned long totalmemory;

    void restart();
    void poolinit(int sizeofobject, int log2objperblk);
    char* getblock(int objectindex);
    void* lookup(int objectindex);
    int newindex(void **newptr);

    arraypool(int sizeofobject, int log2objperblk);
    ~arraypool();
  };

// fastlookup() -- A fast, unsafe operation. Return the pointer to the object
//   with a given index.  Note: The object's block must have been allocated,
//   i.e., by the function newindex().

#define fastlookup(pool, index) \
  (void *) ((pool)->toparray[(index) >> (pool)->log2objectsperblock] + \
            ((index) & (pool)->objectsperblockmark) * (pool)->objectbytes)

//============================================================================//
//                                                                            //
// Memorypool                                                                 //
//                                                                            //
// A structure for memory allocation. (It is written by J. Shewchuk)          //
//                                                                            //
// firstblock is the first block of items. nowblock is the block from which   //
//   items are currently being allocated. nextitem points to the next slab    //
//   of free memory for an item. deaditemstack is the head of a linked list   //
//   (stack) of deallocated items that can be recycled.  unallocateditems is  //
//   the number of items that remain to be allocated from nowblock.           //
//                                                                            //
// Traversal is the process of walking through the entire list of items, and  //
//   is separate from allocation.  Note that a traversal will visit items on  //
//   the "deaditemstack" stack as well as live items.  pathblock points to    //
//   the block currently being traversed.  pathitem points to the next item   //
//   to be traversed.  pathitemsleft is the number of items that remain to    //
//   be traversed in pathblock.                                               //
//                                                                            //
//============================================================================//

  class memorypool {

  public:

    void **firstblock, **nowblock;
    void *nextitem;
    void *deaditemstack;
    void **pathblock;
    void *pathitem;
    int  alignbytes;
    int  itembytes, itemwords;
    int  itemsperblock;
    long items, maxitems;
    int  unallocateditems;
    int  pathitemsleft;

    memorypool();
    memorypool(int, int, int, int);
    ~memorypool();
    
    void poolinit(int, int, int, int);
    void restart();
    void *alloc();
    void dealloc(void*);
    void traversalinit();
    void *traverse();
  };  

//============================================================================//
//                                                                            //
// badface                                                                    //
//                                                                            //
// Despite of its name, a 'badface' can be used to represent one of the       //
// following objects:                                                         //
//   - a face of a tetrahedron which is (possibly) non-Delaunay;              //
//   - an encroached subsegment or subface;                                   //
//   - a bad-quality tetrahedron, i.e, has too large radius-edge ratio;       //
//   - a sliver, i.e., has good radius-edge ratio but nearly zero volume;     //
//   - a recently flipped face (saved for undoing the flip later).            //
//                                                                            //
//============================================================================//

  class badface {
  public:
    triface tt; 
    face ss;
    REAL key, cent[6];  // circumcenter or cos(dihedral angles) at 6 edges.
    point forg, fdest, fapex, foppo, noppo;
    badface *nextitem; 
    badface() : key(0), forg(0), fdest(0), fapex(0), foppo(0), noppo(0),
      nextitem(0) {}
    void init() {
      key = 0.;
      for (int k = 0; k < 6; k++) cent[k] = 0.;
      tt.tet = NULL; tt.ver = 0;
      ss.sh = NULL; ss.shver = 0;
      forg = fdest = fapex = foppo = noppo = NULL;
      nextitem = NULL;
    }
  };

//============================================================================//
//                                                                            //
// insertvertexflags                                                          //
//                                                                            //
// A collection of flags that pass to the routine insertvertex().             //
//                                                                            //
//============================================================================//

  class insertvertexflags {

  public:

    int iloc;  // input/output.
    int bowywat, lawson;
    int splitbdflag, validflag, respectbdflag;
    int rejflag, chkencflag, cdtflag;
    int assignmeshsize;
    int sloc, sbowywat;
    
    // Used by Delaunay refinement.
    int collect_inial_cavity_flag;
    int ignore_near_vertex;
    int check_insert_radius;
    int refineflag; // 0, 1, 2, 3
    triface refinetet;
    face refinesh;
    int smlenflag; // for useinsertradius.
    REAL smlen; // for useinsertradius.
    point parentpt;

    void init() {
      iloc = bowywat = lawson = 0;
      splitbdflag = validflag = respectbdflag = 0;
      rejflag = chkencflag = cdtflag = 0;
      assignmeshsize = 0;
      sloc = sbowywat = 0;

      collect_inial_cavity_flag = 0;
      ignore_near_vertex = 0;
      check_insert_radius = 0;
      refineflag = 0;
      refinetet.tet = NULL;
      refinesh.sh = NULL;
      smlenflag = 0;
      smlen = 0.0;
      parentpt = NULL;
    }

    insertvertexflags() {
      init();
    }
  };

//============================================================================//
//                                                                            //
// flipconstraints                                                            //
//                                                                            //
// A structure of a collection of data (options and parameters) which pass    //
// to the edge flip function flipnm().                                        //
//                                                                            //
//============================================================================//

  class flipconstraints {

  public:

    // Elementary flip flags.
    int enqflag; // (= flipflag)
    int chkencflag;

    // Control flags
    int unflip;  // Undo the performed flips.
    int collectnewtets; // Collect the new tets created by flips.
    int collectencsegflag;

    // Optimization flags.
    int noflip_in_surface; // do not flip edges (not segment) in surface.
    int remove_ndelaunay_edge; // Remove a non-Delaunay edge.
    REAL bak_tetprism_vol; // The value to be minimized.
    REAL tetprism_vol_sum;
    int remove_large_angle; // Remove a large dihedral angle at edge.
    REAL cosdihed_in; // The input cosine of the dihedral angle (> 0).
    REAL cosdihed_out; // The improved cosine of the dihedral angle.
    REAL max_asp_out; // Max asp ratio after the improvement of dihedral angle.

    // Boundary recovery flags.
    int checkflipeligibility;
    point seg[2];  // A constraining edge to be recovered.
    point fac[3];  // A constraining face to be recovered.
    point remvert; // A vertex to be removed.


    flipconstraints() {
      enqflag = 0; 
      chkencflag = 0;

      unflip = 0;
      collectnewtets = 0;
      collectencsegflag = 0;

      noflip_in_surface = 0;
      remove_ndelaunay_edge = 0;
      bak_tetprism_vol = 0.0;
      tetprism_vol_sum = 0.0;
      remove_large_angle = 0;
      cosdihed_in = 0.0;
      cosdihed_out = 0.0;
      max_asp_out = 0.0;

      checkflipeligibility = 0;
      seg[0] = NULL;
      fac[0] = NULL;
      remvert = NULL;
    }
  };

//============================================================================//
//                                                                            //
// optparameters                                                              //
//                                                                            //
// Optimization options and parameters.                                       //
//                                                                            //
//============================================================================//

  class optparameters {

  public:

    // The one of goals of optimization.
    int max_min_volume;      // Maximize the minimum volume.
	int min_max_aspectratio; // Minimize the maximum aspect ratio. 
    int min_max_dihedangle;  // Minimize the maximum dihedral angle.

    // The initial and improved value.
    REAL initval, imprval;

    int numofsearchdirs;
    REAL searchstep;
    int maxiter;  // Maximum smoothing iterations (disabled by -1).
    int smthiter; // Performed iterations.


    optparameters() {
      max_min_volume = 0;
      min_max_aspectratio = 0;
      min_max_dihedangle = 0;

      initval = imprval = 0.0;

      numofsearchdirs = 10;
      searchstep = 0.01;
      maxiter = -1;   // Unlimited smoothing iterations.
      smthiter = 0;

    }
  };


//============================================================================//
//                                                                            //
// Labels (enumeration declarations) used by TetGen.                          //
//                                                                            //
//============================================================================//

  // Labels that signify the type of a vertex. 
  enum verttype {UNUSEDVERTEX, DUPLICATEDVERTEX, RIDGEVERTEX, /*ACUTEVERTEX,*/
                 FACETVERTEX, VOLVERTEX, FREESEGVERTEX, FREEFACETVERTEX, 
                 FREEVOLVERTEX, NREGULARVERTEX, DEADVERTEX};
 
  // Labels that signify the result of triangle-triangle intersection test.
  enum interresult {DISJOINT, INTERSECT, SHAREVERT, SHAREEDGE, SHAREFACE,
                    TOUCHEDGE, TOUCHFACE, ACROSSVERT, ACROSSEDGE, ACROSSFACE,
                    SELF_INTERSECT};

  // Labels that signify the result of point location.
  enum locateresult {UNKNOWN, OUTSIDE, INTETRAHEDRON, ONFACE, ONEDGE, ONVERTEX,
                     ENCVERTEX, ENCSEGMENT, ENCSUBFACE, NEARVERTEX, NONREGULAR,
                     INSTAR, BADELEMENT, NULLCAVITY, SHARPCORNER, FENSEDIN,
                     NONCOPLANAR, SELF_ENCROACH};

//============================================================================//
//                                                                            //
// Variables of TetGen                                                        //
//                                                                            //
//============================================================================//

  // Pointer to the input data (a set of nodes, a PLC, or a mesh).
  tetgenio *in, *addin;

  // Pointer to the switches and parameters.
  tetgenbehavior *b;

  // Pointer to a background mesh (contains size specification map).
  tetgenmesh *bgm;

  // Memorypools to store mesh elements (points, tetrahedra, subfaces, and
  //   segments) and extra pointers between tetrahedra, subfaces, and segments.
  memorypool *tetrahedrons, *subfaces, *subsegs, *points;
  memorypool *tet2subpool, *tet2segpool;

  // Memorypools to store bad-quality (or encroached) elements.
  memorypool *badtetrahedrons, *badsubfacs, *badsubsegs;
  memorypool *split_subfaces_pool, *split_segments_pool;
  arraypool  *unsplit_badtets, *unsplit_subfaces, *unsplit_segments;
  arraypool  *check_tets_list;

  badface *stack_enc_segments, *stack_enc_subfaces;
  
  // Bad quality subfaces are ordered by priority queues.
  badface *queuefront[64];
  badface *queuetail[64];
  int nextnonemptyq[64];
  int firstnonemptyq, recentq;

  // Bad quality tetrahedra are ordered by priority queues.
  memorypool *badqual_tets_pool;
  badface *bt_queuefront[64];
  badface *bt_queuetail[64];
  int bt_nextnonemptyq[64];
  int bt_firstnonemptyq, bt_recentq;
  
  // A memorypool to store faces to be flipped.
  memorypool *flippool;
  arraypool *later_unflip_queue, *unflipqueue;
  badface *flipstack, *unflip_queue_front, *unflip_queue_tail;

  // Arrays used for point insertion (the Bowyer-Watson algorithm).
  arraypool *cavetetlist, *cavebdrylist, *caveoldtetlist;
  arraypool *cave_oldtet_list; // only tetrahedron's
  arraypool *cavetetshlist, *cavetetseglist, *cavetetvertlist;
  arraypool *caveencshlist, *caveencseglist;
  arraypool *caveshlist, *caveshbdlist, *cavesegshlist;
  triface _bw_faces[4096]; // _bw_faces[64][64];

  // Stacks used for CDT construction and boundary recovery.
  arraypool *subsegstack, *subfacstack, *subvertstack;
  arraypool *skipped_segment_list, *skipped_facet_list;

  // Arrays of encroached segments and subfaces (for mesh refinement).
  arraypool *encseglist, *encshlist;

  // The map between facets to their vertices (for mesh refinement).
  int    number_of_facets;
  int   *idx2facetlist;
  point *facetverticeslist;
  int    *idx_segment_facet_list; // segment-to-facet map.
  int    *segment_facet_list;
  int    *idx_ridge_vertex_facet_list; // vertex-to-facet map.
  int    *ridge_vertex_facet_list;

  // The map between segments to their endpoints (for mesh refinement).
  int    segmentendpointslist_length;
  point  *segmentendpointslist;
  double *segment_info_list;
  int    *idx_segment_ridge_vertex_list; // are two ridge vertices form a segment?
  point  *segment_ridge_vertex_list;

  // The infinite vertex.
  point dummypoint;
  // The recently visited tetrahedron, subface.
  triface recenttet;
  face recentsh;

  // PI is the ratio of a circle's circumference to its diameter.
  static REAL PI;

  // The list of subdomains. (-A option).
  int subdomains;                                    // Number of subdomains.
  int *subdomain_markers;

  // Various variables.
  int numpointattrib;                          // Number of point attributes.
  int numelemattrib;                     // Number of tetrahedron attributes.
  int sizeoftensor;                     // Number of REALs per metric tensor.
  int pointmtrindex;           // Index to find the metric tensor of a point.
  int pointparamindex;       // Index to find the u,v coordinates of a point.
  int point2simindex;         // Index to find a simplex adjacent to a point.
  int pointmarkindex;            // Index to find boundary marker of a point.
  int pointinsradiusindex;  // Index to find the insertion radius of a point.
  int elemattribindex;          // Index to find attributes of a tetrahedron.
  int polarindex;                // Index to find the polar plane parameters.
  int volumeboundindex;       // Index to find volume bound of a tetrahedron.
  int elemmarkerindex;              // Index to find marker of a tetrahedron.
  int shmarkindex;             // Index to find boundary marker of a subface.
  int areaboundindex;               // Index to find area bound of a subface.
  int checksubsegflag;   // Are there segments in the tetrahedralization yet?
  int checksubfaceflag;  // Are there subfaces in the tetrahedralization yet?
  int boundary_recovery_flag;
  int checkconstraints;  // Are there variant (node, seg, facet) constraints?
  int nonconvex;                               // Is current mesh non-convex?
  int autofliplinklevel;        // The increase of link levels, default is 1.
  int useinsertradius;       // Save the insertion radius for Steiner points.
  long samples;               // Number of random samples for point location.
  unsigned long randomseed;                    // Current random number seed.
  REAL cosmaxdihed, cosmindihed;    // The cosine values of max/min dihedral.
  REAL cossmtdihed;     // The cosine value of a bad dihedral to be smoothed.
  REAL cosslidihed;      // The cosine value of the max dihedral of a sliver.
  REAL cos_large_dihed;   // The cosine value of large dihedral (135 degree).
  REAL opt_max_sliver_asp_ratio;              // = 10 x b->opt_max_asp_ratio.
  REAL minfaceang, minfacetdihed;     // The minimum input (dihedral) angles.
  REAL cos_facet_separate_ang_tol;
  REAL cos_collinear_ang_tol;
  REAL tetprism_vol_sum;   // The total volume of tetrahedral-prisms (in 4D).
  REAL longest;                          // The longest possible edge length.
  REAL minedgelength;                               // = longest * b->epsion.
  REAL xmax, xmin, ymax, ymin, zmax, zmin;         // Bounding box of points.

  // Options for mesh refinement.
  REAL big_radius_edge_ratio;           // calculated by qualitystatistics().
  REAL smallest_insradius;             // Save the smallest insertion radius.
  long elem_limit;
  long insert_point_count;                 // number of attempted insertions.
  long report_refine_progress;                      // the next report event.
  long last_point_count;         // number of points after last report event.
  long last_insertion_count; // number of insertions after last report event.

  // Counters.  
  long insegments;                               // Number of input segments.  
  long hullsize;                        // Number of exterior boundary faces.
  long meshedges;                                    // Number of mesh edges.
  long meshhulledges;                       // Number of boundary mesh edges.
  long steinerleft;                 // Number of Steiner points not yet used.
  long dupverts;                            // Are there duplicated vertices?
  long unuverts;                                // Are there unused vertices?
  long duplicated_facets_count;              // Are there duplicated facets.?
  long nonregularcount;                    // Are there non-regular vertices?
  long st_segref_count, st_facref_count, st_volref_count;  // Steiner points.
  long fillregioncount, cavitycount, cavityexpcount;
  long flip14count, flip26count, flipn2ncount;
  long flip23count, flip32count, flip44count, flip41count;
  long flip31count, flip22count;
  long opt_flips_count, opt_collapse_count, opt_smooth_count;
  long recover_delaunay_count;
  unsigned long totalworkmemory;      // Total memory used by working arrays.


//============================================================================//
//                                                                            //
// Mesh manipulation primitives                                               //
//                                                                            //
//============================================================================//

  // Fast lookup tables for mesh manipulation primitives.
  static int bondtbl[12][12], fsymtbl[12][12];
  static int esymtbl[12], enexttbl[12], eprevtbl[12];
  static int enextesymtbl[12], eprevesymtbl[12]; 
  static int eorgoppotbl[12], edestoppotbl[12];
  static int facepivot1[12], facepivot2[12][12];
  static int orgpivot[12], destpivot[12], apexpivot[12], oppopivot[12];
  static int tsbondtbl[12][6], stbondtbl[12][6];
  static int tspivottbl[12][6], stpivottbl[12][6];
  static int ver2edge[12], edge2ver[6], epivot[12];
  static int sorgpivot [6], sdestpivot[6], sapexpivot[6];
  static int snextpivot[6];

  void inittables();

  // Primitives for tetrahedra.
  inline tetrahedron encode(triface& t);
  inline tetrahedron encode2(tetrahedron* ptr, int ver);
  inline void decode(tetrahedron ptr, triface& t);
  inline tetrahedron* decode_tet_only(tetrahedron ptr);
  inline int  decode_ver_only(tetrahedron ptr);
  inline void bond(triface& t1, triface& t2);
  inline void dissolve(triface& t);
  inline void esym(triface& t1, triface& t2);
  inline void esymself(triface& t);
  inline void enext(triface& t1, triface& t2);
  inline void enextself(triface& t);
  inline void eprev(triface& t1, triface& t2);
  inline void eprevself(triface& t);
  inline void enextesym(triface& t1, triface& t2);
  inline void enextesymself(triface& t);
  inline void eprevesym(triface& t1, triface& t2);
  inline void eprevesymself(triface& t);
  inline void eorgoppo(triface& t1, triface& t2);
  inline void eorgoppoself(triface& t);
  inline void edestoppo(triface& t1, triface& t2);
  inline void edestoppoself(triface& t);
  inline void fsym(triface& t1, triface& t2);
  inline void fsymself(triface& t);
  inline void fnext(triface& t1, triface& t2);
  inline void fnextself(triface& t);
  inline point org (triface& t);
  inline point dest(triface& t);
  inline point apex(triface& t);
  inline point oppo(triface& t);
  inline void setorg (triface& t, point p);
  inline void setdest(triface& t, point p);
  inline void setapex(triface& t, point p);
  inline void setoppo(triface& t, point p);
  inline REAL elemattribute(tetrahedron* ptr, int attnum);
  inline void setelemattribute(tetrahedron* ptr, int attnum, REAL value);
  inline REAL* get_polar(tetrahedron* ptr);
  inline REAL get_volume(tetrahedron* ptr);
  inline REAL volumebound(tetrahedron* ptr);
  inline void setvolumebound(tetrahedron* ptr, REAL value);
  inline int  elemindex(tetrahedron* ptr);
  inline void setelemindex(tetrahedron* ptr, int value);
  inline int  elemmarker(tetrahedron* ptr);
  inline void setelemmarker(tetrahedron* ptr, int value);
  inline void infect(triface& t);
  inline void uninfect(triface& t);
  inline bool infected(triface& t);
  inline void marktest(triface& t);
  inline void unmarktest(triface& t);
  inline bool marktested(triface& t);
  inline void markface(triface& t);
  inline void unmarkface(triface& t);
  inline bool facemarked(triface& t);
  inline void markedge(triface& t);
  inline void unmarkedge(triface& t);
  inline bool edgemarked(triface& t);
  inline void marktest2(triface& t);
  inline void unmarktest2(triface& t);
  inline bool marktest2ed(triface& t);
  inline int  elemcounter(triface& t);
  inline void setelemcounter(triface& t, int value);
  inline void increaseelemcounter(triface& t);
  inline void decreaseelemcounter(triface& t);
  inline bool ishulltet(triface& t);
  inline bool isdeadtet(triface& t);
 
  // Primitives for subfaces and subsegments.
  inline void sdecode(shellface sptr, face& s);
  inline shellface sencode(face& s);
  inline shellface sencode2(shellface *sh, int shver);
  inline void spivot(face& s1, face& s2);
  inline void spivotself(face& s);
  inline void sbond(face& s1, face& s2);
  inline void sbond1(face& s1, face& s2);
  inline void sdissolve(face& s);
  inline point sorg(face& s);
  inline point sdest(face& s);
  inline point sapex(face& s);
  inline void setsorg(face& s, point pointptr);
  inline void setsdest(face& s, point pointptr);
  inline void setsapex(face& s, point pointptr);
  inline void sesym(face& s1, face& s2);
  inline void sesymself(face& s);
  inline void senext(face& s1, face& s2);
  inline void senextself(face& s);
  inline void senext2(face& s1, face& s2);
  inline void senext2self(face& s);
  inline REAL areabound(face& s);
  inline void setareabound(face& s, REAL value);
  inline int shellmark(face& s);
  inline void setshellmark(face& s, int value);
  inline void sinfect(face& s);
  inline void suninfect(face& s);
  inline bool sinfected(face& s);
  inline void smarktest(face& s);
  inline void sunmarktest(face& s);
  inline bool smarktested(face& s);
  inline void smarktest2(face& s);
  inline void sunmarktest2(face& s);
  inline bool smarktest2ed(face& s);
  inline void smarktest3(face& s);
  inline void sunmarktest3(face& s);
  inline bool smarktest3ed(face& s);
  inline void setfacetindex(face& f, int value);
  inline int  getfacetindex(face& f);
  inline bool isdeadsh(face& s);

  // Primitives for interacting tetrahedra and subfaces.
  inline void tsbond(triface& t, face& s);
  inline void tsdissolve(triface& t);
  inline void stdissolve(face& s);
  inline void tspivot(triface& t, face& s);
  inline void stpivot(face& s, triface& t);

  // Primitives for interacting tetrahedra and segments.
  inline void tssbond1(triface& t, face& seg);
  inline void sstbond1(face& s, triface& t);
  inline void tssdissolve1(triface& t);
  inline void sstdissolve1(face& s);
  inline void tsspivot1(triface& t, face& s);
  inline void sstpivot1(face& s, triface& t);

  // Primitives for interacting subfaces and segments.
  inline void ssbond(face& s, face& edge);
  inline void ssbond1(face& s, face& edge);
  inline void ssdissolve(face& s);
  inline void sspivot(face& s, face& edge);

  // Primitives for points.
  inline int  pointmark(point pt);
  inline void setpointmark(point pt, int value);
  inline enum verttype pointtype(point pt);
  inline void setpointtype(point pt, enum verttype value);
  inline int  pointgeomtag(point pt);
  inline void setpointgeomtag(point pt, int value);
  inline REAL pointgeomuv(point pt, int i);
  inline void setpointgeomuv(point pt, int i, REAL value);
  inline void pinfect(point pt);
  inline void puninfect(point pt);
  inline bool pinfected(point pt);
  inline void pmarktest(point pt);
  inline void punmarktest(point pt);
  inline bool pmarktested(point pt);
  inline void pmarktest2(point pt);
  inline void punmarktest2(point pt);
  inline bool pmarktest2ed(point pt);
  inline void pmarktest3(point pt);
  inline void punmarktest3(point pt);
  inline bool pmarktest3ed(point pt);
  inline tetrahedron point2tet(point pt);
  inline void setpoint2tet(point pt, tetrahedron value);
  inline shellface point2sh(point pt);
  inline void setpoint2sh(point pt, shellface value);
  inline point point2ppt(point pt);
  inline void setpoint2ppt(point pt, point value);
  inline tetrahedron point2bgmtet(point pt);
  inline void setpoint2bgmtet(point pt, tetrahedron value);
  inline void setpointinsradius(point pt, REAL value);
  inline REAL getpointinsradius(point pt);
  inline bool issteinerpoint(point pt);

  // Advanced primitives.
  inline void point2tetorg(point pt, triface& t);
  inline void point2shorg(point pa, face& s);
  inline point farsorg(face& seg);
  inline point farsdest(face& seg);

//============================================================================//
//                                                                            //
//  Memory managment                                                          //
//                                                                            //
//============================================================================//

  void tetrahedrondealloc(tetrahedron*);
  tetrahedron *tetrahedrontraverse();
  tetrahedron *alltetrahedrontraverse();
  void shellfacedealloc(memorypool*, shellface*);
  shellface *shellfacetraverse(memorypool*);
  void pointdealloc(point);
  point pointtraverse();

  void makeindex2pointmap(point*&);
  void makepoint2submap(memorypool*, int*&, face*&);
  void maketetrahedron(triface*);
  void maketetrahedron2(triface*, point, point, point, point);
  void makeshellface(memorypool*, face*);
  void makepoint(point*, enum verttype);

  void initializepools();

//============================================================================//
//                                                                            //
// Advanced geometric predicates and calculations                             //
//                                                                            //
// the routine insphere_s() implements a simplified symbolic perturbation     //
// scheme from Edelsbrunner, et al [*].  Hence the point-in-sphere test never //
// returns a zero. The idea is to perturb the weights of vertices in 4D.      //
//                                                                            //
// The routine tri_edge_test() determines whether or not a triangle and an    //
// edge intersect in 3D. If they do cross, their intersection type is also    //
// reported. This test is a combination of n 3D orientation tests (3 < n < 9).//
// It uses the robust orient3d() test to make the branch decisions.           //
//                                                                            //
// There are several routines to calculate geometrical quantities, e.g.,      //
// circumcenters, angles, dihedral angles, face normals, face areas, etc.     //
// They are implemented using floating-point arithmetics.                     //
//                                                                            //
//============================================================================//

  // Symbolic perturbations (robust)
  REAL insphere_s(REAL*, REAL*, REAL*, REAL*, REAL*);
  REAL orient4d_s(REAL*, REAL*, REAL*, REAL*, REAL*, 
                  REAL, REAL, REAL, REAL, REAL);

  // An embedded 2-dimensional geometric predicate (non-robust)
  REAL incircle3d(point pa, point pb, point pc, point pd);

  // Triangle-edge intersection test (robust)
  int tri_edge_2d(point, point, point, point, point, point, int, int*, int*);
  int tri_edge_tail(point,point,point,point,point,point,REAL,REAL,int,int*,int*);
  int tri_edge_test(point, point, point, point, point, point, int, int*, int*);

    // Triangle-triangle intersection test (robust)
  int tri_edge_inter_tail(point, point, point, point, point, REAL, REAL);
  int tri_tri_inter(point, point, point, point, point, point);

  // Linear algebra functions
  inline REAL dot(REAL* v1, REAL* v2);
  inline void cross(REAL* v1, REAL* v2, REAL* n);
  bool lu_decmp(REAL lu[4][4], int n, int* ps, REAL* d, int N);
  void lu_solve(REAL lu[4][4], int n, int* ps, REAL* b, int N);

  // Geometric calculations (non-robust)
  REAL orient3dfast(REAL *pa, REAL *pb, REAL *pc, REAL *pd);
  inline REAL norm2(REAL x, REAL y, REAL z);
  inline REAL distance(REAL* p1, REAL* p2);
  inline REAL distance2(REAL* p1, REAL* p2);
  void facenormal(point pa, point pb, point pc, REAL *n, int pivot, REAL *lav);
  REAL facedihedral(REAL* pa, REAL* pb, REAL* pc1, REAL* pc2);
  REAL triarea(REAL* pa, REAL* pb, REAL* pc);
  REAL interiorangle(REAL* o, REAL* p1, REAL* p2, REAL* n);
  REAL cos_interiorangle(REAL* o, REAL* p1, REAL* p2);
  void projpt2edge(REAL* p, REAL* e1, REAL* e2, REAL* prj);
  void projpt2face(REAL* p, REAL* f1, REAL* f2, REAL* f3, REAL* prj);
  bool circumsphere(REAL*, REAL*, REAL*, REAL*, REAL* cent, REAL* radius);
  bool orthosphere(REAL*,REAL*,REAL*,REAL*,REAL,REAL,REAL,REAL,REAL*,REAL*);
  void planelineint(REAL*, REAL*, REAL*, REAL*, REAL*, REAL*, REAL*);
  int  linelineint(REAL*, REAL*, REAL*, REAL*, REAL*, REAL*, REAL*, REAL*);
  REAL tetprismvol(REAL* pa, REAL* pb, REAL* pc, REAL* pd);
  bool calculateabovepoint(arraypool*, point*, point*, point*);
  void calculateabovepoint4(point, point, point, point);

//============================================================================//
//                                                                            //
// Local mesh transformations                                                 //
//                                                                            //
// A local transformation replaces a set of tetrahedra with another set that  //
// partitions the same space and boundaries.                                  //
//                                                                            //
// In 3D, the most straightforward local transformations are the elementary   //
// flips performed within the convex hull of five vertices: 2-to-3, 3-to-2,   //
// 1-to-4, and 4-to-1 flips. The numbers indicate the number of tetrahedra    //
// before and after each flip.  The 1-to-4 and 4-to-1 flip involve inserting  //
// or deleting a vertex, respectively.                                        //
//                                                                            //
// There are complex local transformations that are a combination of element- //
// ary flips. For example, a 4-to-4 flip, which replaces two coplanar edges,  //
// combines a 2-to-3 flip and a 3-to-2 flip. Note that the first 2-to-3 flip  //
// will temporarily create a degenerate tetrahedron removed immediately by    //
// the followed 3-to-2 flip.  More generally, an n-to-m flip, where n > 3,    //
// m = (n - 2) * 2, which removes an edge, can be done by first performing a  //
// sequence of (n - 3) 2-to-3 flips followed by a 3-to-2 flip.                //
//                                                                            //
// The routines flip23(), flip32(), and flip41() perform the three elementray //
// flips. The flip14() is available inside the routine insertpoint().         //
//                                                                            //
// The routines flipnm() and flipnm_post() implement a generalized edge flip  //
// algorithm that uses elementary flips.                                      //
//                                                                            //
// The routine insertpoint() implements the Bowyer-Watson's cavity algorithm  //
// to insert a vertex.  It works for arbitrary tetrahedralization,  either    //
// Delaunay, or constrained Delaunay, or non-Delaunay.                        //
//                                                                            //
//============================================================================//

  void flippush(badface*&, triface*);

  // The elementary flips.
  void flip23(triface*, int, flipconstraints* fc);
  void flip32(triface*, int, flipconstraints* fc);
  void flip41(triface*, int, flipconstraints* fc);

  // A generalized edge flip.
  int flipnm(triface*, int n, int level, int, flipconstraints* fc);
  int flipnm_post(triface*, int n, int nn, int, flipconstraints* fc);

  // Point insertion.
  int  insertpoint(point, triface*, face*, face*, insertvertexflags*);
  void insertpoint_abort(face*, insertvertexflags*);

//============================================================================//
//                                                                            //
// Delaunay tetrahedralization                                                //
//                                                                            //
// The routine incrementaldelaunay() implemented two incremental algorithms   //
// for constructing Delaunay tetrahedralizations (DTs):  the Bowyer-Watson    //
// (B-W) algorithm and the incremental flip algorithm of Edelsbrunner and     //
// Shah, "Incremental topological flipping works for regular triangulation,"  //
// Algorithmica, 15:233-241, 1996.                                            //
//                                                                            //
// The routine incrementalflip() implements the flip algorithm of [Edelsbrun- //
// ner and Shah, 1996].  It flips a queue of locally non-Delaunay faces (in   //
// arbitrary order).  The success is guaranteed when the Delaunay tetrahedra- //
// lization is constructed incrementally by adding one vertex at a time.      //
//                                                                            //
// The routine locate() finds a tetrahedron contains a new point in current   //
// DT. It uses a simple stochastic walk algorithm: starting from an arbitrary //
// tetrahedron in DT, it finds the destination by visit one tetrahedron at a  //
// time, randomly chooses a tetrahedron if there are more than one choices.   //
// This algorithm terminates due to Edelsbrunner's acyclic theorem.           //
//                                                                            //
// Choose a good starting tetrahedron is crucial to the speed of the walk.    //
// TetGen initially uses the "jump-and-walk" algorithm of Muecke, E.P., Saias,//
// I., and Zhu, B. "Fast Randomized Point Location Without Preprocessing." In //
// Proceedings of the 12th ACM Symposium on Computational Geometry, 274-283,  //
// 1996.  It first randomly samples several tetrahedra in the DT and then     //
// choosing the closet one to start walking.                                  //
//                                                                            //
// The above algorithm slows download dramatically as the number of points    //
// grows -- reported in Amenta, N., Choi, S. and Rote, G., "Incremental       //
// construction con {BRIO}," In Proceedings of 19th ACM Symposium on Computa- //
// tional Geometry, 211-219, 2003. On the other hand, Liu and Snoeyink showed //
// that the point location could be made in constant time if the points are   //
// pre-sorted so that the nearby points in space have nearby indices, then    //
// adding the points in this order. They sorted the points along the 3D       //
// Hilbert curve.                                                             //
//                                                                            //
// The routine hilbert_sort3() sorts a set of 3D points along the 3D Hilbert  //
// curve. It recursively splits a point set according to the Hilbert indices  //
// mapped to the subboxes of the bounding box of the point set. The Hilbert   //
// indices is calculated by Butz's algorithm in 1971. An excellent exposition //
// of this algorithm can be found in the paper of Hamilton, C., "Compact      //
// Hilbert Indices", Technical Report CS-2006-07, Computer Science, Dalhousie //
// University, 2006 (the Section 2). My implementation also referenced Steven //
// Witham's performance of "Hilbert walk" (hopefully, it is still available   //
// at http://www.tiac.net/~sw/2008/10/Hilbert/).                              //
//                                                                            //
// TetGen sorts the points using the method in the paper of Boissonnat,J.-D., //
// Devillers, O. and Hornus, S. "Incremental Construction of the Delaunay     //
// Triangulation and the Delaunay Graph in Medium Dimension," In Proceedings  //
// of the 25th ACM Symposium on Computational Geometry, 2009.  It first       //
// randomly sorts the points into subgroups using the Biased Randomized       //
// Insertion Ordering (BRIO) of Amenta et al 2003, then sorts the points in   //
// each subgroup along the 3D Hilbert curve.  Inserting points in this order  //
// ensure a randomized "sprinkling" of the points over the domain, while      //
// sorting of each subset provides locality.                                  //
//                                                                            //
//============================================================================//

  void transfernodes();

  // Point sorting.
  int  transgc[8][3][8], tsb1mod3[8];
  void hilbert_init(int n);
  int  hilbert_split(point* vertexarray, int arraysize, int gc0, int gc1,
                     REAL, REAL, REAL, REAL, REAL, REAL);
  void hilbert_sort3(point* vertexarray, int arraysize, int e, int d,
                     REAL, REAL, REAL, REAL, REAL, REAL, int depth);
  void brio_multiscale_sort(point*,int,int threshold,REAL ratio,int* depth);

  // Point location.
  unsigned long randomnation(unsigned int choices);
  void randomsample(point searchpt, triface *searchtet);
  enum locateresult locate(point searchpt, triface *searchtet, int chkencflag = 0);

  // Incremental Delaunay construction.
  enum locateresult locate_dt(point searchpt, triface *searchtet);
  int  insert_vertex_bw(point, triface*, insertvertexflags*);
  void initialdelaunay(point pa, point pb, point pc, point pd);
  void incrementaldelaunay(clock_t&);

//============================================================================//
//                                                                            //
// Surface triangulation                                                      //
//                                                                            //
//============================================================================//

  void flipshpush(face*);
  void flip22(face*, int, int);
  void flip31(face*, int);
  long lawsonflip();
  int sinsertvertex(point newpt, face*, face*, int iloc, int bowywat, int);
  int sremovevertex(point delpt, face*, face*, int lawson);

  enum locateresult slocate(point, face*, int, int, int);
  enum interresult sscoutsegment(face*, point, int, int, int);
  void scarveholes(int, REAL*);
  int triangulate(int, arraypool*, arraypool*, int, REAL*);

  void unifysegments();
  void identifyinputedges(point*);
  void mergefacets();
  void meshsurface();


//============================================================================//
//                                                                            //
// Constrained Delaunay tetrahedralization                                    //
//                                                                            //
// A constrained Delaunay tetrahedralization (CDT) is a variation of a Delau- //
// nay tetrahedralization (DT) that respects the boundary of a 3D PLC (mesh   //
// domain).  A crucial difference between a CDT and a DT is that triangles in //
// the PLC's polygons are not required to be locally Delaunay, which frees    //
// the CDT to respect the PLC's polygons better. CDTs have optimal properties //
// similar to those of DTs.                                                   //
//                                                                            //
// Steiner Points and Steiner CDTs. It is well-known that even a simple 3D    //
// polyhedron may not have a tetrahedralization which only uses its vertices. //
// Some extra points, so-called "Steiner points" are needed to form a tetrah- //
// edralization of such polyhedron.  A Steiner CDT of a 3D PLC is a CDT       //
// containing Steiner points. TetGen generates Steiner CDTs.                  //
//                                                                            //
// The routine constraineddelaunay() creates a (Steiner) CDT of the PLC       //
// (including Steiner points). It has two steps, (1) segment recovery and (2) //
// facet (polygon) recovery.                                                  //
//                                                                            //
// The routine delaunizesegments() implements the segment recovery algorithm  //
// of Si, H., and Gaertner, K. "Meshing Piecewise Linear Complexes by         //
// Constrained Delaunay Tetrahedralizations," In Proceedings of the 14th      //
// International Meshing Roundtable, 147--163, 2005.  It adds Steiner points  //
// into non-Delaunay segments until all subsegments appear together in a DT.  //
// The running time of this algorithm is proportional to the number of        //
// Steiner points.                                                            //
//                                                                            //
// There are two incremental facet recovery algorithms: the cavity re-        //
// triangulation algorithm of Si, H., and Gaertner, K. "3D Boundary Recovery  //
// by Constrained Delaunay Tetrahedralization," International Journal for     //
// Numerical Methods in Engineering, 85:1341-1364, 2011, and the flip         //
// algorithm of Shewchuk, J. "Updating and Constructing Constrained Delaunay  //
// and Constrained Regular Triangulations by Flips." In Proceedings of the    //
// 19th ACM Symposium on Computational Geometry, 86-95, 2003.                 //
//                                                                            //
// Although no Steiner point is needed in step (2), a facet with non-coplanar //
// vertices might need Steiner points. It is discussed in the paper of Si, H.,//
// and  Shewchuk, J., "Incrementally Constructing and Updating Constrained    //
// Delaunay Tetrahedralizations with Finite Precision Coordinates." In        //
// Proceedings of the 21th International Meshing Roundtable, 2012.            //
//                                                                            //
// Our implementation of the facet recovery algorithms recovers a "missing    //
// region" at a time. Each missing region is a subset of connected interiors  //
// of a polygon. The routine formcavity() creates the cavity of crossing      //
// tetrahedra of the missing region. The cavity re-triangulation algorithm is //
// implemented by three subroutines, delaunizecavity(), fillcavity(), and     //
// carvecavity(). Since it may fail due to non-coplanar vertices, the         //
// subroutine restorecavity() is used to restore the original cavity.         //
//                                                                            //
// The routine flipinsertfacet() implements the flip algorithm. The sub-      //
// routine flipcertify() is used to maintain the priority queue of flips.     //
// The routine refineregion() is called when the facet recovery algorithm     //
// fails to recover a missing region. It inserts Steiner points to refine the //
// missing region. To avoid inserting Steiner points very close to existing   //
// segments.  The classical encroachment rules of the Delaunay refinement     //
// algorithm are used to choose the Steiner points.  The routine              //
// constrainedfacets() does the facet recovery by using either the cavity re- //
// triangulation algorithm (default) or the flip algorithm. It results in a   //
// CDT of the (modified) PLC (including Steiner points).                      //
//                                                                            //
//============================================================================//

  enum interresult finddirection(triface* searchtet, point endpt);
  enum interresult scoutsegment(point, point, face*, triface*, point*, 
                                arraypool*);
  int  getsteinerptonsegment(face* seg, point refpt, point steinpt);
  void delaunizesegments();

  int  scoutsubface(face* searchsh,triface* searchtet,int shflag);
  void formregion(face*, arraypool*, arraypool*, arraypool*);
  int  scoutcrossedge(triface& crosstet, arraypool*, arraypool*);
  bool formcavity(triface*, arraypool*, arraypool*, arraypool*, arraypool*, 
                  arraypool*, arraypool*);
  // Facet recovery by cavity re-triangulation [Si and Gaertner 2011].
  void delaunizecavity(arraypool*, arraypool*, arraypool*, arraypool*, 
                       arraypool*, arraypool*);
  bool fillcavity(arraypool*, arraypool*, arraypool*, arraypool*,
                  arraypool*, arraypool*, triface* crossedge);
  void carvecavity(arraypool*, arraypool*, arraypool*);
  void restorecavity(arraypool*, arraypool*, arraypool*, arraypool*);
  // Facet recovery by flips [Shewchuk 2003].
  void flipcertify(triface *chkface, badface **pqueue, point, point, point);
  void flipinsertfacet(arraypool*, arraypool*, arraypool*, arraypool*);

  int  insertpoint_cdt(point, triface*, face*, face*, insertvertexflags*,
                       arraypool*, arraypool*, arraypool*, arraypool*,
                       arraypool*, arraypool*);
  void refineregion(face&, arraypool*, arraypool*, arraypool*, arraypool*,
                    arraypool*, arraypool*);
  void constrainedfacets();  

  void constraineddelaunay(clock_t&);

//============================================================================//
//                                                                            //
// Constrained tetrahedralizations.                                           //
//                                                                            //
//============================================================================//

  void sort_2pts(point p1, point p2, point ppt[2]);
  void sort_3pts(point p1, point p2, point p3, point ppt[3]);

  bool is_collinear_at(point mid, point left, point right);
  bool is_segment(point p1, point p2);
  bool valid_constrained_f23(triface&, point pd, point pe);
  bool valid_constrained_f32(triface*, point pa, point pb);
  
  int checkflipeligibility(int fliptype, point, point, point, point, point,
                           int level, int edgepivot, flipconstraints* fc);

  int removeedgebyflips(triface*, flipconstraints*);
  int removefacebyflips(triface*, flipconstraints*);

  int recoveredgebyflips(point, point, face*, triface*, int fullsearch, int& idir);
  int add_steinerpt_in_schoenhardtpoly(triface*, int, int, int chkencflag);
  int add_steinerpt_in_segment(face*, int searchlevel, int& idir); 
  int add_steinerpt_to_recover_edge(point, point, face*, int, int, int& idir);
  int recoversegments(arraypool*, int fullsearch, int steinerflag);

  int recoverfacebyflips(point,point,point,face*,triface*,int&,point*,point*);
  int recoversubfaces(arraypool*, int steinerflag);

  int getvertexstar(int, point searchpt, arraypool*, arraypool*, arraypool*);
  int getedge(point, point, triface*);
  int reduceedgesatvertex(point startpt, arraypool* endptlist);
  int removevertexbyflips(point steinerpt);

  int smoothpoint(point smtpt, arraypool*, int ccw, optparameters *opm);
  int suppressbdrysteinerpoint(point steinerpt);
  int suppresssteinerpoints();

  void recoverboundary(clock_t&);

//============================================================================//
//                                                                            //
// Mesh reconstruction                                                        //
//                                                                            //
//============================================================================//

  void carveholes();

  void reconstructmesh();

  int  search_face(point p0, point p1, point p2, triface &tetloop);
  int  search_edge(point p0, point p1, triface &tetloop);
  int  scout_point(point, triface*, int randflag);
  REAL getpointmeshsize(point, triface*, int iloc);
  void interpolatemeshsize();

  void insertconstrainedpoints(point *insertarray, int arylen, int rejflag);
  void insertconstrainedpoints(tetgenio *addio);

  void collectremovepoints(arraypool *remptlist);
  void meshcoarsening();

//============================================================================//
//                                                                            //
// Mesh refinement                                                            //
//                                                                            //
// The purpose of mesh refinement is to obtain a tetrahedral mesh with well-  //
// -shaped tetrahedra and appropriate mesh size.  It is necessary to insert   //
// new Steiner points to achieve this property. The questions are (1) how to  //
// choose the Steiner points? and (2) how to insert them?                     //
//                                                                            //
// Delaunay refinement is a technique first developed by Chew [1989] and      //
// Ruppert [1993, 1995] to generate quality triangular meshes in the plane.   //
// It provides guarantee on the smallest angle of the triangles.  Rupper's    //
// algorithm guarantees that the mesh is size-optimal (to within a constant   //
// factor) among all meshes with the same quality.                            //
//   Shewchuk generalized Ruppert's algorithm into 3D in his PhD thesis       //
// [Shewchuk 1997]. A short version of his algorithm appears in "Tetrahedral  //
// Mesh Generation by Delaunay Refinement," In Proceedings of the 14th ACM    //
// Symposium on Computational Geometry, 86-95, 1998.  It guarantees that all  //
// tetrahedra of the output mesh have a "radius-edge ratio" (equivalent to    //
// the minimal face angle) bounded. However, it does not remove slivers, a    //
// type of very flat tetrahedra which can have no small face angles but have  //
// very small (and large) dihedral angles. Moreover, it may not terminate if  //
// the input PLC contains "sharp features", e.g., two edges (or two facets)   //
// meet at an acute angle (or dihedral angle).                                //
//                                                                            //
// TetGen uses the basic Delaunay refinement scheme to insert Steiner points. //
// While it always maintains a constrained Delaunay mesh.  The algorithm is   //
// described in Si, H., "Adaptive Constrained Delaunay Mesh Generation,"      //
// International Journal for Numerical Methods in Engineering, 75:856-880.    //
// This algorithm always terminates and sharp features are easily preserved.  //
// The mesh has good quality (same as Shewchuk's Delaunay refinement algori-  //
// thm) in the bulk of the mesh domain. Moreover, it supports the generation  //
// of adaptive mesh according to a (isotropic) mesh sizing function.          //
//                                                                            //
//============================================================================//

  void makesegmentendpointsmap();
  REAL set_ridge_vertex_protecting_ball(point);
  REAL get_min_angle_at_ridge_vertex(face* seg);
  REAL get_min_diahedral_angle(face* seg);
  void create_segment_info_list();

  void makefacetverticesmap();
  void create_segment_facet_map();

  int  ridge_vertices_adjacent(point, point);
  int  facet_ridge_vertex_adjacent(face *, point);
  int  segsegadjacent(face *, face *);
  int  segfacetadjacent(face *checkseg, face *checksh);
  int  facetfacetadjacent(face *, face *);
  bool is_sharp_segment(face* seg);
  bool does_seg_contain_acute_vertex(face* seg);
  bool create_a_shorter_edge(point steinerpt, point nearpt);

  void enqueuesubface(memorypool*, face*);
  void enqueuetetrahedron(triface*);

  bool check_encroachment(point pa, point pb, point checkpt);
  bool check_enc_segment(face *chkseg, point *pencpt);  
  bool get_steiner_on_segment(face* seg, point encpt, point newpt);
  bool split_segment(face *splitseg, point encpt, REAL *param, int qflag, int, int*);
  void repairencsegs(REAL *param, int qflag, int chkencflag);

  bool get_subface_ccent(face *chkfac, REAL *ccent);
  bool check_enc_subface(face *chkfac, point *pencpt, REAL *ccent, REAL *radius);
  bool check_subface(face *chkfac, REAL *ccent, REAL radius, REAL *param);
  void enqueue_subface(face *bface, point encpt, REAL *ccent, REAL *param);
  badface* top_subface();
  void dequeue_subface();
  void parallel_shift(point pa, point pb, point pc, point pt, REAL* ppt);
  enum locateresult locate_on_surface(point searchpt, face* searchsh);
  bool split_subface(face *splitfac, point encpt, REAL *ccent, REAL*, int, int, int*);
  void repairencfacs(REAL *param, int qflag, int chkencflag);

  bool check_tetrahedron(triface *chktet, REAL* param, int& qflag);
  bool checktet4split(triface *chktet, REAL* param, int& qflag);
  enum locateresult locate_point_walk(point searchpt, triface*, int chkencflag);
  bool split_tetrahedron(triface*, REAL*, int, int, insertvertexflags &ivf);
  void repairbadtets(REAL queratio, int chkencflag);

  void delaunayrefinement();

//============================================================================//
//                                                                            //
// Mesh optimization                                                          //
//                                                                            //
//============================================================================//

  long lawsonflip3d(flipconstraints *fc);
  void recoverdelaunay();

  int  get_seg_laplacian_center(point mesh_vert, REAL target[3]);
  int  get_surf_laplacian_center(point mesh_vert, REAL target[3]);
  int  get_laplacian_center(point mesh_vert, REAL target[3]);
  bool move_vertex(point mesh_vert, REAL target[3]);
  void smooth_vertices();

  bool get_tet(point, point, point, point, triface *);
  bool get_tetqual(triface *chktet, point oppo_pt, badface *bf);
  bool get_tetqual(point, point, point, point, badface *bf);
  void enqueue_badtet(badface *bf);
  badface* top_badtet();
  void dequeue_badtet();

  bool add_steinerpt_to_repair(badface *bf, bool bSmooth);
  bool flip_edge_to_improve(triface *sliver_edge, REAL& improved_cosmaxd);
  bool repair_tet(badface *bf, bool bFlips, bool bSmooth, bool bSteiners);
  long repair_badqual_tets(bool bFlips, bool bSmooth, bool bSteiners);
  void improve_mesh();

//============================================================================//
//                                                                            //
// Mesh check and statistics                                                  //
//                                                                            //
//============================================================================//

  // Mesh validations.
  int check_mesh(int topoflag);
  int check_shells();
  int check_segments();
  int check_delaunay(int perturb = 1);
  int check_regular(int);
  int check_conforming(int);

  //  Mesh statistics.
  void printfcomma(unsigned long n);
  void qualitystatistics();
  void memorystatistics();
  void statistics();

//============================================================================//
//                                                                            //
// Mesh output                                                                //
//                                                                            //
//============================================================================//

  void jettisonnodes();
  void highorder();
  void indexelements();
  void numberedges();
  void outnodes(tetgenio*);
  void outmetrics(tetgenio*);
  void outelements(tetgenio*);
  void outfaces(tetgenio*);
  void outhullfaces(tetgenio*);
  void outsubfaces(tetgenio*);
  void outedges(tetgenio*);
  void outsubsegments(tetgenio*);
  void outneighbors(tetgenio*);
  void outvoronoi(tetgenio*);
  void outsmesh(char*);
  void outmesh2medit(char*);
  void outmesh2vtk(char*, int);
  void out_surfmesh_vtk(char*, int);
  void out_intersected_facets();




//============================================================================//
//                                                                            //
// Constructor & destructor                                                   //
//                                                                            //
//============================================================================//

  void initializetetgenmesh()
  {
    in  = addin = NULL;
    b   = NULL;
    bgm = NULL;

    tetrahedrons = subfaces = subsegs = points = NULL;
    tet2segpool = tet2subpool = NULL;
    dummypoint = NULL;

    badtetrahedrons = badsubfacs = badsubsegs = NULL;
    split_segments_pool = split_subfaces_pool = NULL;
    unsplit_badtets = unsplit_subfaces = unsplit_segments = NULL;
    check_tets_list = NULL;
    badqual_tets_pool = NULL;

    stack_enc_segments = stack_enc_subfaces = NULL;
  
    flippool = NULL;
    flipstack = unflip_queue_front = unflip_queue_tail = NULL;
    later_unflip_queue = unflipqueue = NULL;

    cavetetlist = cavebdrylist = caveoldtetlist = NULL;
    cave_oldtet_list = NULL;
    cavetetshlist = cavetetseglist = cavetetvertlist = NULL;
    caveencshlist = caveencseglist = NULL;
    caveshlist = caveshbdlist = cavesegshlist = NULL;

    subsegstack = subfacstack = subvertstack = NULL;
    skipped_segment_list = skipped_facet_list = NULL;
    
    encseglist = encshlist = NULL;
    
    number_of_facets = 0;
    idx2facetlist = NULL;
    facetverticeslist = NULL;
    idx_segment_facet_list = NULL;
    segment_facet_list = NULL;
    idx_ridge_vertex_facet_list = NULL;
    ridge_vertex_facet_list = NULL;

    segmentendpointslist_length = 0;
    segmentendpointslist = NULL;
    segment_info_list = NULL;
    idx_segment_ridge_vertex_list = NULL;
    segment_ridge_vertex_list = NULL;

    subdomains = 0;
    subdomain_markers = NULL;

    numpointattrib = numelemattrib = 0;
    sizeoftensor = 0;
    pointmtrindex = 0;
    pointparamindex = 0;
    pointmarkindex = 0;
    point2simindex = 0;
    pointinsradiusindex = 0;
    elemattribindex = 0;
    polarindex = 0;
    volumeboundindex = 0;
    shmarkindex = 0;
    areaboundindex = 0;
    checksubsegflag = 0;
    checksubfaceflag = 0;
    boundary_recovery_flag = 0;
    checkconstraints = 0;
    nonconvex = 0;
    autofliplinklevel = 1;
    useinsertradius = 0;
    samples = 0l;
    randomseed = 1l;
    minfaceang = minfacetdihed = PI;
    cos_facet_separate_ang_tol = cos(179.9/180.*PI);
    cos_collinear_ang_tol = cos(179.9/180.*PI);
    tetprism_vol_sum = 0.0;
    longest = minedgelength = 0.0;
    xmax = xmin = ymax = ymin = zmax = zmin = 0.0;

    smallest_insradius = 1.e+30;
    big_radius_edge_ratio = 100.0;
    elem_limit = 0;
    insert_point_count = 0l;
    report_refine_progress = 0l;
    last_point_count = 0l;
    last_insertion_count = 0l;

    insegments = 0l;
    hullsize = 0l;
    meshedges = meshhulledges = 0l;
    steinerleft = -1;
    dupverts = 0l;
    unuverts = 0l;
    duplicated_facets_count = 0l;
    nonregularcount = 0l;
    st_segref_count = st_facref_count = st_volref_count = 0l;
    fillregioncount = cavitycount = cavityexpcount = 0l;
    flip14count = flip26count = flipn2ncount = 0l;
    flip23count = flip32count = flip44count = flip41count = 0l;
    flip22count = flip31count = 0l;
    recover_delaunay_count = 0l;
    opt_flips_count = opt_collapse_count = opt_smooth_count = 0l;
    totalworkmemory = 0l;

  } // tetgenmesh()

  void freememory()
  {
    if (bgm != NULL) {
      delete bgm;
    }

    if (points != (memorypool *) NULL) {
      delete points;
      delete [] dummypoint;
    }
    if (tetrahedrons != (memorypool *) NULL) {
      delete tetrahedrons;
    }
    if (subfaces != (memorypool *) NULL) {
      delete subfaces;
      delete subsegs;
    }
    if (tet2segpool != NULL) {
      delete tet2segpool;
      delete tet2subpool;
    }

    if (badtetrahedrons) {
      delete badtetrahedrons;
    }
    if (badsubfacs) {
      delete badsubfacs;
    }
    if (badsubsegs) {
      delete badsubsegs;
    }
    if (unsplit_badtets) {
      delete unsplit_badtets;
    }
    if (check_tets_list) {
      delete check_tets_list;
    }

    if (flippool != NULL) {
      delete flippool;
      delete later_unflip_queue;
      delete unflipqueue;
    }

    if (cavetetlist != NULL) {
      delete cavetetlist;
      delete cavebdrylist;
      delete caveoldtetlist;
      delete cavetetvertlist;
      delete cave_oldtet_list;
    }

    if (caveshlist != NULL) {
      delete caveshlist;
      delete caveshbdlist;
      delete cavesegshlist;
      delete cavetetshlist;
      delete cavetetseglist;
      delete caveencshlist;
      delete caveencseglist;
    }

    if (subsegstack != NULL) {
      delete subsegstack;
      delete subfacstack;
      delete subvertstack;
    }

    if (idx2facetlist != NULL) {
      delete [] idx2facetlist;
      delete [] facetverticeslist;
      delete [] idx_segment_facet_list;
      delete [] segment_facet_list;
      delete [] idx_ridge_vertex_facet_list;
      delete [] ridge_vertex_facet_list;
    }

    if (segmentendpointslist != NULL) {
      delete [] segmentendpointslist;
      delete [] idx_segment_ridge_vertex_list;
      delete [] segment_ridge_vertex_list;
    }

    if (segment_info_list != NULL) {
      delete [] segment_info_list;
    }

    if (subdomain_markers != NULL) {
      delete [] subdomain_markers;
    }

    initializetetgenmesh();
  }

  tetgenmesh()
  {
    initializetetgenmesh();
  }

  ~tetgenmesh()
  {
    freememory();
  } // ~tetgenmesh()

};                                               // End of class tetgenmesh.

//============================================================================//
//                                                                            //
// tetrahedralize()    Interface for using TetGen's library to generate       //
//                     Delaunay tetrahedralizations, constrained Delaunay     //
//                     tetrahedralizations, quality tetrahedral meshes.       //
//                                                                            //
// 'in' is an object of 'tetgenio' containing a PLC or a previously generated //
// tetrahedral mesh you want to refine.  'out' is another object of 'tetgenio'//
// for returing the generated tetrahedral mesh. If it is a NULL pointer, the  //
// output mesh is saved to file(s). If 'bgmin' != NULL, it contains a back-   //
// ground mesh defining a mesh size function.                                 //
//                                                                            //
//============================================================================//

void tetrahedralize(tetgenbehavior *b, tetgenio *in, tetgenio *out, 
                    tetgenio *addin = NULL, tetgenio *bgmin = NULL);

#ifdef TETLIBRARY
void tetrahedralize(char *switches, tetgenio *in, tetgenio *out,
                    tetgenio *addin = NULL, tetgenio *bgmin = NULL);

#endif // #ifdef TETLIBRARY

//============================================================================//
//                                                                            //
// terminatetetgen()    Terminate TetGen with a given exit code.              //
//                                                                            //
//============================================================================//


inline void terminatetetgen(tetgenmesh *m, int x)
{
#ifdef TETLIBRARY
  throw x;
#else
  switch (x) {
  case 1: // Out of memory.
    printf("Error:  Out of memory.\n"); 
    break;
  case 2: // Encounter an internal error.
    printf("Please report this bug to Hang.Si@wias-berlin.de. Include\n");
    printf("  the message above, your input data set, and the exact\n");
    printf("  command line you used to run this program, thank you.\n");
    break;
  case 3:
    printf("The input surface mesh contain self-intersections. Program stopped.\n");
    //printf("Hint: use -d option to detect all self-intersections.\n");
    break;
  case 4:
    printf("A very small input feature size was detected. Program stopped.\n");
    if (m) {
      printf("Hint: use -T option to set a smaller tolerance. Current is %g\n",
             m->b->epsilon);
    }
    break;
  case 5:
    printf("Two very close input facets were detected. Program stopped.\n");
    printf("Hint: use -Y option to avoid adding Steiner points in boundary.\n");
    break;
  case 10:
    printf("An input error was detected. Program stopped.\n"); 
    break;
  case 200:
    printf("Boundary contains Steiner points (-YY option). Program stopped.\n");
    break;
  } // switch (x)
  exit(x);
#endif // #ifdef TETLIBRARY
}

//============================================================================//
//                                                                            //
// Primitives for tetrahedra                                                  //
//                                                                            //
//============================================================================//

// encode()  compress a handle into a single pointer.  It relies on the 
//   assumption that all addresses of tetrahedra are aligned to sixteen-
//   byte boundaries, so that the last four significant bits are zero.

inline tetgenmesh::tetrahedron tetgenmesh::encode(triface& t) {
  return (tetrahedron) ((uintptr_t) (t).tet | (uintptr_t) (t).ver);
}

inline tetgenmesh::tetrahedron tetgenmesh::encode2(tetrahedron* ptr, int ver) {
  return (tetrahedron) ((uintptr_t) (ptr) | (uintptr_t) (ver));
}

// decode()  converts a pointer to a handle. The version is extracted from
//   the four least significant bits of the pointer.

inline void tetgenmesh::decode(tetrahedron ptr, triface& t) {
  (t).ver = (int) ((uintptr_t) (ptr) & (uintptr_t) 15);
  (t).tet = (tetrahedron *) ((uintptr_t) (ptr) ^ (uintptr_t) (t).ver);
}

inline tetgenmesh::tetrahedron* tetgenmesh::decode_tet_only(tetrahedron ptr)
{
  return (tetrahedron *) ((((uintptr_t) ptr) >> 4) << 4);
}

inline int tetgenmesh::decode_ver_only(tetrahedron ptr)
{
  return (int) ((uintptr_t) (ptr) & (uintptr_t) 15);
}

// bond()  connects two tetrahedra together. (t1,v1) and (t2,v2) must 
//   refer to the same face and the same edge. 

inline void tetgenmesh::bond(triface& t1, triface& t2) {
  t1.tet[t1.ver & 3] = encode2(t2.tet, bondtbl[t1.ver][t2.ver]);
  t2.tet[t2.ver & 3] = encode2(t1.tet, bondtbl[t2.ver][t1.ver]);
}


// dissolve()  a bond (from one side).

inline void tetgenmesh::dissolve(triface& t) {
  t.tet[t.ver & 3] = NULL;
}

// enext()  finds the next edge (counterclockwise) in the same face.

inline void tetgenmesh::enext(triface& t1, triface& t2) {
  t2.tet = t1.tet;
  t2.ver = enexttbl[t1.ver]; // (t1.ver + 4) % 12;
}

inline void tetgenmesh::enextself(triface& t) {
  t.ver = enexttbl[t.ver]; // (t.ver + 4) % 12;
}

// eprev()   finds the next edge (clockwise) in the same face.

inline void tetgenmesh::eprev(triface& t1, triface& t2) {
  t2.tet = t1.tet;
  t2.ver = eprevtbl[t1.ver]; // (t1.ver + 8) % 12;
}

inline void tetgenmesh::eprevself(triface& t) {
  t.ver = eprevtbl[t.ver]; // (t.ver + 8) % 12;
}

// esym()  finds the reversed edge.  It is in the other face of the
//   same tetrahedron.

inline void tetgenmesh::esym(triface& t1, triface& t2) {
  (t2).tet = (t1).tet;
  (t2).ver = esymtbl[(t1).ver];
}

inline void tetgenmesh::esymself(triface& t) {
  (t).ver = esymtbl[(t).ver];
}

// enextesym()  finds the reversed edge of the next edge. It is in the other
//   face of the same tetrahedron. It is the combination esym() * enext(). 

inline void tetgenmesh::enextesym(triface& t1, triface& t2) {
  t2.tet = t1.tet;
  t2.ver = enextesymtbl[t1.ver];
}

inline void tetgenmesh::enextesymself(triface& t) {
  t.ver = enextesymtbl[t.ver];
}

// eprevesym()  finds the reversed edge of the previous edge.

inline void tetgenmesh::eprevesym(triface& t1, triface& t2) {
  t2.tet = t1.tet;
  t2.ver = eprevesymtbl[t1.ver];
}

inline void tetgenmesh::eprevesymself(triface& t) {
  t.ver = eprevesymtbl[t.ver];
}

// eorgoppo()    Finds the opposite face of the origin of the current edge.
//               Return the opposite edge of the current edge.

inline void tetgenmesh::eorgoppo(triface& t1, triface& t2) {
  t2.tet = t1.tet;
  t2.ver = eorgoppotbl[t1.ver];
}

inline void tetgenmesh::eorgoppoself(triface& t) {
  t.ver = eorgoppotbl[t.ver];
}

// edestoppo()    Finds the opposite face of the destination of the current 
//                edge. Return the opposite edge of the current edge.

inline void tetgenmesh::edestoppo(triface& t1, triface& t2) {
  t2.tet = t1.tet;
  t2.ver = edestoppotbl[t1.ver];
}

inline void tetgenmesh::edestoppoself(triface& t) {
  t.ver = edestoppotbl[t.ver];
}

// fsym()  finds the adjacent tetrahedron at the same face and the same edge.

inline void tetgenmesh::fsym(triface& t1, triface& t2) {
  decode((t1).tet[(t1).ver & 3], t2);
  t2.ver = fsymtbl[t1.ver][t2.ver];
}


#define fsymself(t) \
  t1ver = (t).ver; \
  decode((t).tet[(t).ver & 3], (t));\
  (t).ver = fsymtbl[t1ver][(t).ver]

// fnext()  finds the next face while rotating about an edge according to
//   a right-hand rule. The face is in the adjacent tetrahedron.  It is
//   the combination: fsym() * esym().

inline void tetgenmesh::fnext(triface& t1, triface& t2) {
  decode(t1.tet[facepivot1[t1.ver]], t2);
  t2.ver = facepivot2[t1.ver][t2.ver];
}


#define fnextself(t) \
  t1ver = (t).ver; \
  decode((t).tet[facepivot1[(t).ver]], (t)); \
  (t).ver = facepivot2[t1ver][(t).ver]


// The following primtives get or set the origin, destination, face apex,
//   or face opposite of an ordered tetrahedron.

inline tetgenmesh::point tetgenmesh::org(triface& t) {
  return (point) (t).tet[orgpivot[(t).ver]];
}

inline tetgenmesh::point tetgenmesh:: dest(triface& t) {
  return (point) (t).tet[destpivot[(t).ver]];
}

inline tetgenmesh::point tetgenmesh:: apex(triface& t) {
  return (point) (t).tet[apexpivot[(t).ver]];
}

inline tetgenmesh::point tetgenmesh:: oppo(triface& t) {
  return (point) (t).tet[oppopivot[(t).ver]];
}

inline void tetgenmesh:: setorg(triface& t, point p) {
  (t).tet[orgpivot[(t).ver]] = (tetrahedron) (p);
}

inline void tetgenmesh:: setdest(triface& t, point p) {
  (t).tet[destpivot[(t).ver]] = (tetrahedron) (p);
}

inline void tetgenmesh:: setapex(triface& t, point p) {
  (t).tet[apexpivot[(t).ver]] = (tetrahedron) (p);
}

inline void tetgenmesh:: setoppo(triface& t, point p) {
  (t).tet[oppopivot[(t).ver]] = (tetrahedron) (p);
}

#define setvertices(t, torg, tdest, tapex, toppo) \
  (t).tet[orgpivot[(t).ver]] = (tetrahedron) (torg);\
  (t).tet[destpivot[(t).ver]] = (tetrahedron) (tdest); \
  (t).tet[apexpivot[(t).ver]] = (tetrahedron) (tapex); \
  (t).tet[oppopivot[(t).ver]] = (tetrahedron) (toppo)


inline REAL* tetgenmesh::get_polar(tetrahedron* ptr)
{
  return &(((REAL *) (ptr))[polarindex]);
}
inline REAL tetgenmesh::get_volume(tetrahedron* ptr)
{
  return ((REAL *) (ptr))[polarindex + 4];
}

// Check or set a tetrahedron's attributes.

inline REAL tetgenmesh::elemattribute(tetrahedron* ptr, int attnum) {
  return ((REAL *) (ptr))[elemattribindex + attnum];
}

inline void tetgenmesh::setelemattribute(tetrahedron* ptr, int attnum, 
  REAL value) {
  ((REAL *) (ptr))[elemattribindex + attnum] = value;
}

// Check or set a tetrahedron's maximum volume bound.

inline REAL tetgenmesh::volumebound(tetrahedron* ptr) {
  return ((REAL *) (ptr))[volumeboundindex];
}

inline void tetgenmesh::setvolumebound(tetrahedron* ptr, REAL value) {
  ((REAL *) (ptr))[volumeboundindex] = value;
}

// Get or set a tetrahedron's index (only used for output).
//    These two routines use the reserved slot ptr[10].

inline int tetgenmesh::elemindex(tetrahedron* ptr) {
  int *iptr = (int *) &(ptr[10]);
  return iptr[0];
}

inline void tetgenmesh::setelemindex(tetrahedron* ptr, int value) {
  int *iptr = (int *) &(ptr[10]);
  iptr[0] = value;
}

// Get or set a tetrahedron's marker. 
//   Set 'value = 0' cleans all the face/edge flags.

inline int tetgenmesh::elemmarker(tetrahedron* ptr) {
  return ((int *) (ptr))[elemmarkerindex];
}

inline void tetgenmesh::setelemmarker(tetrahedron* ptr, int value) {
  ((int *) (ptr))[elemmarkerindex] = value;
}

// infect(), infected(), uninfect() -- primitives to flag or unflag a
//   tetrahedron. The last bit of the element marker is flagged (1)
//   or unflagged (0).

inline void tetgenmesh::infect(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] |= 1;
}

inline void tetgenmesh::uninfect(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] &= ~1;
}

inline bool tetgenmesh::infected(triface& t) {
  return (((int *) (t.tet))[elemmarkerindex] & 1) != 0;
}

// marktest(), marktested(), unmarktest() -- primitives to flag or unflag a
//   tetrahedron.  Use the second lowerest bit of the element marker.

inline void tetgenmesh::marktest(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] |= 2;
}

inline void tetgenmesh::unmarktest(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] &= ~2;
}
    
inline bool tetgenmesh::marktested(triface& t) {
  return (((int *) (t.tet))[elemmarkerindex] & 2) != 0;
}

// markface(), unmarkface(), facemarked() -- primitives to flag or unflag a
//   face of a tetrahedron.  From the last 3rd to 6th bits are used for
//   face markers, e.g., the last third bit corresponds to loc = 0. 

inline void tetgenmesh::markface(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] |= (4 << (t.ver & 3));
}

inline void tetgenmesh::unmarkface(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] &= ~(4 << (t.ver & 3));
}

inline bool tetgenmesh::facemarked(triface& t) {
  return (((int *) (t.tet))[elemmarkerindex] & (4 << (t.ver & 3))) != 0;
}

// markedge(), unmarkedge(), edgemarked() -- primitives to flag or unflag an
//   edge of a tetrahedron.  From the last 7th to 12th bits are used for
//   edge markers, e.g., the last 7th bit corresponds to the 0th edge, etc. 
//   Remark: The last 7th bit is marked by 2^6 = 64.

inline void tetgenmesh::markedge(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] |= (int) (64 << ver2edge[(t).ver]);
}

inline void tetgenmesh::unmarkedge(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] &= ~(int) (64 << ver2edge[(t).ver]);
}

inline bool tetgenmesh::edgemarked(triface& t) {
  return (((int *) (t.tet))[elemmarkerindex] & 
           (int) (64 << ver2edge[(t).ver])) != 0;
}

// marktest2(), unmarktest2(), marktest2ed() -- primitives to flag and unflag
//   a tetrahedron. The 13th bit (2^12 = 4096) is used for this flag.

inline void tetgenmesh::marktest2(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] |= (int) (4096);
}

inline void tetgenmesh::unmarktest2(triface& t) {
  ((int *) (t.tet))[elemmarkerindex] &= ~(int) (4096);
}

inline bool tetgenmesh::marktest2ed(triface& t) {
  return (((int *) (t.tet))[elemmarkerindex] & (int) (4096)) != 0;
}

// elemcounter(), setelemcounter() -- primitives to read or ser a (small)
//   integer counter in this tet. It is saved from the 16th bit. On 32 bit
//   system, the range of the counter is [0, 2^15 = 32768]. 

inline int tetgenmesh::elemcounter(triface& t) {
  return (((int *) (t.tet))[elemmarkerindex]) >> 16;
}

inline void tetgenmesh::setelemcounter(triface& t, int value) {
  int c = ((int *) (t.tet))[elemmarkerindex];
  // Clear the old counter while keep the other flags.
  c &= 65535; // sum_{i=0^15} 2^i
  c |= (value << 16);
  ((int *) (t.tet))[elemmarkerindex] = c;
}

inline void tetgenmesh::increaseelemcounter(triface& t) {
  int c = elemcounter(t);
  setelemcounter(t, c + 1);
}

inline void tetgenmesh::decreaseelemcounter(triface& t) {
  int c = elemcounter(t);
  setelemcounter(t, c - 1);
}

// ishulltet()  tests if t is a hull tetrahedron.

inline bool tetgenmesh::ishulltet(triface& t) {
  return (point) (t).tet[7] == dummypoint;
}

// isdeadtet()  tests if t is a tetrahedron is dead.

inline bool tetgenmesh::isdeadtet(triface& t) {
  return ((t.tet == NULL) || (t.tet[4] == NULL));
}

//============================================================================//
//                                                                            //
// Primitives for subfaces and subsegments                                    //
//                                                                            //
//============================================================================//

// Each subface contains three pointers to its neighboring subfaces, with
//   edge versions.  To save memory, both information are kept in a single
//   pointer. To make this possible, all subfaces are aligned to eight-byte
//   boundaries, so that the last three bits of each pointer are zeros. An
//   edge version (in the range 0 to 5) is compressed into the last three
//   bits of each pointer by 'sencode()'.  'sdecode()' decodes a pointer,
//   extracting an edge version and a pointer to the beginning of a subface.

inline void tetgenmesh::sdecode(shellface sptr, face& s) {
  s.shver = (int) ((uintptr_t) (sptr) & (uintptr_t) 7);
  s.sh = (shellface *) ((uintptr_t) (sptr) ^ (uintptr_t) (s.shver));
}

inline tetgenmesh::shellface tetgenmesh::sencode(face& s) {
  return (shellface) ((uintptr_t) s.sh | (uintptr_t) s.shver);
}

inline tetgenmesh::shellface tetgenmesh::sencode2(shellface *sh, int shver) {
  return (shellface) ((uintptr_t) sh | (uintptr_t) shver);
}

// sbond() bonds two subfaces (s1) and (s2) together. s1 and s2 must refer
//   to the same edge. No requirement is needed on their orientations.

inline void tetgenmesh::sbond(face& s1, face& s2) 
{
  s1.sh[s1.shver >> 1] = sencode(s2);
  s2.sh[s2.shver >> 1] = sencode(s1);
}

// sbond1() bonds s1 <== s2, i.e., after bonding, s1 is pointing to s2,
//   but s2 is not pointing to s1.  s1 and s2 must refer to the same edge.
//   No requirement is needed on their orientations.

inline void tetgenmesh::sbond1(face& s1, face& s2) 
{
  s1.sh[s1.shver >> 1] = sencode(s2);
}

// Dissolve a subface bond (from one side).  Note that the other subface
//   will still think it's connected to this subface.

inline void tetgenmesh::sdissolve(face& s)
{
  s.sh[s.shver >> 1] = NULL;
}

// spivot() finds the adjacent subface (s2) for a given subface (s1).
//   s1 and s2 share at the same edge.

inline void tetgenmesh::spivot(face& s1, face& s2) 
{
  shellface sptr = s1.sh[s1.shver >> 1];
  sdecode(sptr, s2);
}

inline void tetgenmesh::spivotself(face& s) 
{
  shellface sptr = s.sh[s.shver >> 1];
  sdecode(sptr, s);
}

// These primitives determine or set the origin, destination, or apex
//   of a subface with respect to the edge version.

inline tetgenmesh::point tetgenmesh::sorg(face& s) 
{
  return (point) s.sh[sorgpivot[s.shver]];
}

inline tetgenmesh::point tetgenmesh::sdest(face& s) 
{
  return (point) s.sh[sdestpivot[s.shver]];
}

inline tetgenmesh::point tetgenmesh::sapex(face& s) 
{
  return (point) s.sh[sapexpivot[s.shver]];
}

inline void tetgenmesh::setsorg(face& s, point pointptr) 
{
  s.sh[sorgpivot[s.shver]] = (shellface) pointptr;
}

inline void tetgenmesh::setsdest(face& s, point pointptr) 
{
  s.sh[sdestpivot[s.shver]] = (shellface) pointptr;
}

inline void tetgenmesh::setsapex(face& s, point pointptr) 
{
  s.sh[sapexpivot[s.shver]] = (shellface) pointptr;
}

#define setshvertices(s, pa, pb, pc)\
  setsorg(s, pa);\
  setsdest(s, pb);\
  setsapex(s, pc)

// sesym()  reserves the direction of the lead edge.

inline void tetgenmesh::sesym(face& s1, face& s2) 
{
  s2.sh = s1.sh;
  s2.shver = (s1.shver ^ 1);  // Inverse the last bit.
}

inline void tetgenmesh::sesymself(face& s) 
{
  s.shver ^= 1;
}

// senext()  finds the next edge (counterclockwise) in the same orientation
//   of this face.

inline void tetgenmesh::senext(face& s1, face& s2) 
{
  s2.sh = s1.sh;
  s2.shver = snextpivot[s1.shver];
}

inline void tetgenmesh::senextself(face& s) 
{
  s.shver = snextpivot[s.shver];
}

inline void tetgenmesh::senext2(face& s1, face& s2) 
{
  s2.sh = s1.sh;
  s2.shver = snextpivot[snextpivot[s1.shver]];
}

inline void tetgenmesh::senext2self(face& s) 
{
  s.shver = snextpivot[snextpivot[s.shver]];
}


// Check or set a subface's maximum area bound.

inline REAL tetgenmesh::areabound(face& s) 
{
  return ((REAL *) (s.sh))[areaboundindex];
}

inline void tetgenmesh::setareabound(face& s, REAL value) 
{
  ((REAL *) (s.sh))[areaboundindex] = value;
}

// These two primitives read or set a shell marker.  Shell markers are used
//   to hold user boundary information.

inline int tetgenmesh::shellmark(face& s) 
{
  return ((int *) (s.sh))[shmarkindex];
}

inline void tetgenmesh::setshellmark(face& s, int value) 
{
  ((int *) (s.sh))[shmarkindex] = value;
}



// sinfect(), sinfected(), suninfect() -- primitives to flag or unflag a
//   subface. The last bit of ((int *) ((s).sh))[shmarkindex+1] is flagged.

inline void tetgenmesh::sinfect(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *) ((s).sh))[shmarkindex+1] | (int) 1);
}

inline void tetgenmesh::suninfect(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *) ((s).sh))[shmarkindex+1] & ~(int) 1);
}

// Test a subface for viral infection.

inline bool tetgenmesh::sinfected(face& s) 
{
  return (((int *) ((s).sh))[shmarkindex+1] & (int) 1) != 0;
}

// smarktest(), smarktested(), sunmarktest() -- primitives to flag or unflag
//   a subface. The last 2nd bit of the integer is flagged.

inline void tetgenmesh::smarktest(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *)((s).sh))[shmarkindex+1] | (int) 2);
}

inline void tetgenmesh::sunmarktest(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *)((s).sh))[shmarkindex+1] & ~(int)2);
}

inline bool tetgenmesh::smarktested(face& s) 
{
  return ((((int *) ((s).sh))[shmarkindex+1] & (int) 2) != 0);
}

// smarktest2(), smarktest2ed(), sunmarktest2() -- primitives to flag or 
//   unflag a subface. The last 3rd bit of the integer is flagged.

inline void tetgenmesh::smarktest2(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *)((s).sh))[shmarkindex+1] | (int) 4);
}

inline void tetgenmesh::sunmarktest2(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *)((s).sh))[shmarkindex+1] & ~(int)4);
}

inline bool tetgenmesh::smarktest2ed(face& s) 
{
  return ((((int *) ((s).sh))[shmarkindex+1] & (int) 4) != 0);
}

// The last 4th bit of ((int *) ((s).sh))[shmarkindex+1] is flagged.

inline void tetgenmesh::smarktest3(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *)((s).sh))[shmarkindex+1] | (int) 8);
}

inline void tetgenmesh::sunmarktest3(face& s) 
{
  ((int *) ((s).sh))[shmarkindex+1] = 
    (((int *)((s).sh))[shmarkindex+1] & ~(int)8);
}

inline bool tetgenmesh::smarktest3ed(face& s) 
{
  return ((((int *) ((s).sh))[shmarkindex+1] & (int) 8) != 0);
}


// Each facet has a unique index (automatically indexed). Starting from '0'.
// We save this index in the same field of the shell type. 

inline void tetgenmesh::setfacetindex(face& s, int value)
{
  ((int *) (s.sh))[shmarkindex + 2] = value;
}

inline int tetgenmesh::getfacetindex(face& s)
{
  return ((int *) (s.sh))[shmarkindex + 2];
}

// Tests if the subface (subsegment) s is dead.

inline bool tetgenmesh::isdeadsh(face& s) {
  return ((s.sh == NULL) || (s.sh[3] == NULL));
}

//============================================================================//
//                                                                            //
// Primitives for interacting between tetrahedra and subfaces                 //
//                                                                            //
//============================================================================//

// tsbond() bond a tetrahedron (t) and a subface (s) together.
// Note that t and s must be the same face and the same edge. Moreover,
//   t and s have the same orientation. 
// Since the edge number in t and in s can be any number in {0,1,2}. We bond
//   the edge in s which corresponds to t's 0th edge, and vice versa.

inline void tetgenmesh::tsbond(triface& t, face& s)
{
  if ((t).tet[9] == NULL) {
    // Allocate space for this tet.
    (t).tet[9] = (tetrahedron) tet2subpool->alloc();
    // Initialize.
    for (int i = 0; i < 4; i++) {
      ((shellface *) (t).tet[9])[i] = NULL;
    }
  }
  // Bond t <== s.
  ((shellface *) (t).tet[9])[(t).ver & 3] = 
    sencode2((s).sh, tsbondtbl[t.ver][s.shver]);
  // Bond s <== t.
  s.sh[9 + ((s).shver & 1)] = 
    (shellface) encode2((t).tet, stbondtbl[t.ver][s.shver]);
}

// tspivot() finds a subface (s) abutting on the given tetrahdera (t).
//   Return s.sh = NULL if there is no subface at t. Otherwise, return
//   the subface s, and s and t must be at the same edge wth the same
//   orientation.

inline void tetgenmesh::tspivot(triface& t, face& s) 
{
  if ((t).tet[9] == NULL) {
    (s).sh = NULL;
    return;
  }
  // Get the attached subface s.
  sdecode(((shellface *) (t).tet[9])[(t).ver & 3], (s));
  (s).shver = tspivottbl[t.ver][s.shver];
}

// Quickly check if the handle (t, v) is a subface.
#define issubface(t) \
  ((t).tet[9] && ((t).tet[9])[(t).ver & 3])

// stpivot() finds a tetrahedron (t) abutting a given subface (s).
//   Return the t (if it exists) with the same edge and the same
//   orientation of s.

inline void tetgenmesh::stpivot(face& s, triface& t) 
{
  decode((tetrahedron) s.sh[9 + (s.shver & 1)], t);
  if ((t).tet == NULL) {
    return;
  }
  (t).ver = stpivottbl[t.ver][s.shver];
}

// Quickly check if this subface is attached to a tetrahedron.

#define isshtet(s) \
  ((s).sh[9 + ((s).shver & 1)])

// tsdissolve() dissolve a bond (from the tetrahedron side).

inline void tetgenmesh::tsdissolve(triface& t) 
{
  if ((t).tet[9] != NULL) {
    ((shellface *) (t).tet[9])[(t).ver & 3] = NULL;
  }
}

// stdissolve() dissolve a bond (from the subface side).

inline void tetgenmesh::stdissolve(face& s) 
{
  (s).sh[9] = NULL;
  (s).sh[10] = NULL;
}

//============================================================================//
//                                                                            //
// Primitives for interacting between subfaces and segments                   //
//                                                                            //
//============================================================================//

// ssbond() bond a subface to a subsegment.

inline void tetgenmesh::ssbond(face& s, face& edge) 
{
  s.sh[6 + (s.shver >> 1)] = sencode(edge);
  edge.sh[0] = sencode(s);
}

inline void tetgenmesh::ssbond1(face& s, face& edge) 
{
  s.sh[6 + (s.shver >> 1)] = sencode(edge);
  //edge.sh[0] = sencode(s);
}

// ssdisolve() dissolve a bond (from the subface side)

inline void tetgenmesh::ssdissolve(face& s) 
{
  s.sh[6 + (s.shver >> 1)] = NULL;
}

// sspivot() finds a subsegment abutting a subface.

inline void tetgenmesh::sspivot(face& s, face& edge) 
{
  sdecode((shellface) s.sh[6 + (s.shver >> 1)], edge);
}

// Quickly check if the edge is a subsegment.

#define isshsubseg(s) \
  ((s).sh[6 + ((s).shver >> 1)])

//============================================================================//
//                                                                            //
// Primitives for interacting between tetrahedra and segments                 //
//                                                                            //
//============================================================================//

inline void tetgenmesh::tssbond1(triface& t, face& s)
{
  if ((t).tet[8] == NULL) {
    // Allocate space for this tet.
    (t).tet[8] = (tetrahedron) tet2segpool->alloc();
    // Initialization.
    for (int i = 0; i < 6; i++) {
      ((shellface *) (t).tet[8])[i] = NULL;
    }
  }
  ((shellface *) (t).tet[8])[ver2edge[(t).ver]] = sencode((s)); 
}

inline void tetgenmesh::sstbond1(face& s, triface& t) 
{
  ((tetrahedron *) (s).sh)[9] = encode(t);
}

inline void tetgenmesh::tssdissolve1(triface& t)
{
  if ((t).tet[8] != NULL) {
    ((shellface *) (t).tet[8])[ver2edge[(t).ver]] = NULL;
  }
}

inline void tetgenmesh::sstdissolve1(face& s) 
{
  ((tetrahedron *) (s).sh)[9] = NULL;
}

inline void tetgenmesh::tsspivot1(triface& t, face& s)
{
  if ((t).tet[8] != NULL) {
    sdecode(((shellface *) (t).tet[8])[ver2edge[(t).ver]], s);
  } else {
    (s).sh = NULL;
  }
}

// Quickly check whether 't' is a segment or not.

#define issubseg(t) \
  ((t).tet[8] && ((t).tet[8])[ver2edge[(t).ver]])

inline void tetgenmesh::sstpivot1(face& s, triface& t) 
{
  decode((tetrahedron) s.sh[9], t);
}

//============================================================================//
//                                                                            //
// Primitives for points                                                      //
//                                                                            //
//============================================================================//

inline int tetgenmesh::pointmark(point pt) { 
  return ((int *) (pt))[pointmarkindex]; 
}

inline void tetgenmesh::setpointmark(point pt, int value) {
  ((int *) (pt))[pointmarkindex] = value;
}


// These two primitives set and read the type of the point.

inline enum tetgenmesh::verttype tetgenmesh::pointtype(point pt) {
  return (enum verttype) (((int *) (pt))[pointmarkindex + 1] >> (int) 8);
}

inline void tetgenmesh::setpointtype(point pt, enum verttype value) {
  ((int *) (pt))[pointmarkindex + 1] = 
    ((int) value << 8) + (((int *) (pt))[pointmarkindex + 1] & (int) 255);
}

// pinfect(), puninfect(), pinfected() -- primitives to flag or unflag
//   a point. The last bit of the integer '[pointindex+1]' is flagged.

inline void tetgenmesh::pinfect(point pt) {
  ((int *) (pt))[pointmarkindex + 1] |= (int) 1;
}

inline void tetgenmesh::puninfect(point pt) {
  ((int *) (pt))[pointmarkindex + 1] &= ~(int) 1;
}

inline bool tetgenmesh::pinfected(point pt) {
  return (((int *) (pt))[pointmarkindex + 1] & (int) 1) != 0;
}

// pmarktest(), punmarktest(), pmarktested() -- more primitives to 
//   flag or unflag a point. 

inline void tetgenmesh::pmarktest(point pt) {
  ((int *) (pt))[pointmarkindex + 1] |= (int) 2;
}

inline void tetgenmesh::punmarktest(point pt) {
  ((int *) (pt))[pointmarkindex + 1] &= ~(int) 2;
}

inline bool tetgenmesh::pmarktested(point pt) {
  return (((int *) (pt))[pointmarkindex + 1] & (int) 2) != 0;
}

inline void tetgenmesh::pmarktest2(point pt) {
  ((int *) (pt))[pointmarkindex + 1] |= (int) 4;
}

inline void tetgenmesh::punmarktest2(point pt) {
  ((int *) (pt))[pointmarkindex + 1] &= ~(int) 4;
}

inline bool tetgenmesh::pmarktest2ed(point pt) {
  return (((int *) (pt))[pointmarkindex + 1] & (int) 4) != 0;
}

inline void tetgenmesh::pmarktest3(point pt) {
  ((int *) (pt))[pointmarkindex + 1] |= (int) 8;
}

inline void tetgenmesh::punmarktest3(point pt) {
  ((int *) (pt))[pointmarkindex + 1] &= ~(int) 8;
}

inline bool tetgenmesh::pmarktest3ed(point pt) {
  return (((int *) (pt))[pointmarkindex + 1] & (int) 8) != 0;
}

// Read and set the geometry tag of the point (used by -s option).

inline int tetgenmesh::pointgeomtag(point pt) { 
  return ((int *) (pt))[pointmarkindex + 2]; 
}

inline void tetgenmesh::setpointgeomtag(point pt, int value) {
  ((int *) (pt))[pointmarkindex + 2] = value;
}

// Read and set the u,v coordinates of the point (used by -s option).

inline REAL tetgenmesh::pointgeomuv(point pt, int i) {
  return pt[pointparamindex + i];
}

inline void tetgenmesh::setpointgeomuv(point pt, int i, REAL value) {
  pt[pointparamindex + i] = value;
}



// These following primitives set and read a pointer to a tetrahedron
//   a subface/subsegment, a point, or a tet of background mesh.

inline tetgenmesh::tetrahedron tetgenmesh::point2tet(point pt) {
  return ((tetrahedron *) (pt))[point2simindex];
}

inline void tetgenmesh::setpoint2tet(point pt, tetrahedron value) {
  ((tetrahedron *) (pt))[point2simindex] = value;
}

inline tetgenmesh::point tetgenmesh::point2ppt(point pt) {
  return (point) ((tetrahedron *) (pt))[point2simindex + 1];
}

inline void tetgenmesh::setpoint2ppt(point pt, point value) {
  ((tetrahedron *) (pt))[point2simindex + 1] = (tetrahedron) value;
}

inline tetgenmesh::shellface tetgenmesh::point2sh(point pt) {
  return (shellface) ((tetrahedron *) (pt))[point2simindex + 2];
}

inline void tetgenmesh::setpoint2sh(point pt, shellface value) {
  ((tetrahedron *) (pt))[point2simindex + 2] = (tetrahedron) value;
}


inline tetgenmesh::tetrahedron tetgenmesh::point2bgmtet(point pt) {
  return ((tetrahedron *) (pt))[point2simindex + 3];
}

inline void tetgenmesh::setpoint2bgmtet(point pt, tetrahedron value) {
  ((tetrahedron *) (pt))[point2simindex + 3] = value;
}


// The primitives for saving and getting the insertion radius.
inline void tetgenmesh::setpointinsradius(point pt, REAL value)
{
  pt[pointinsradiusindex] = value;
}

inline REAL tetgenmesh::getpointinsradius(point pt)
{
  return pt[pointinsradiusindex];
}

inline bool tetgenmesh::issteinerpoint(point pt) {
 return (pointtype(pt) == FREESEGVERTEX) || (pointtype(pt) == FREEFACETVERTEX)
        || (pointtype(pt) == FREEVOLVERTEX);
}

// point2tetorg()    Get the tetrahedron whose origin is the point.

inline void tetgenmesh::point2tetorg(point pa, triface& searchtet)
{
  decode(point2tet(pa), searchtet);
  if ((point) searchtet.tet[4] == pa) {
    searchtet.ver = 11;
  } else if ((point) searchtet.tet[5] == pa) {
    searchtet.ver = 3;
  } else if ((point) searchtet.tet[6] == pa) {
    searchtet.ver = 7;
  } else {
    searchtet.ver = 0;
  }
}

// point2shorg()    Get the subface/segment whose origin is the point.

inline void tetgenmesh::point2shorg(point pa, face& searchsh)
{
  sdecode(point2sh(pa), searchsh);
  if ((point) searchsh.sh[3] == pa) {
    searchsh.shver = 0;
  } else if ((point) searchsh.sh[4] == pa) {
    searchsh.shver = (searchsh.sh[5] != NULL ? 2 : 1); 
  } else {
    searchsh.shver = 4;
  }
}

// farsorg()    Return the origin of the subsegment.
// farsdest()   Return the destination of the subsegment.

inline tetgenmesh::point tetgenmesh::farsorg(face& s)
{
  face travesh, neighsh;

  travesh = s;
  while (1) {
    senext2(travesh, neighsh);
    spivotself(neighsh); 
    if (neighsh.sh == NULL) break;
    if (sorg(neighsh) != sorg(travesh)) sesymself(neighsh);
    senext2(neighsh, travesh); 
  }
  return sorg(travesh);
}

inline tetgenmesh::point tetgenmesh::farsdest(face& s) 
{
  face travesh, neighsh;

  travesh = s;
  while (1) {
    senext(travesh, neighsh);
    spivotself(neighsh); 
    if (neighsh.sh == NULL) break;
    if (sdest(neighsh) != sdest(travesh)) sesymself(neighsh);
    senext(neighsh, travesh); 
  }
  return sdest(travesh);
}

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// Linear algebra operators.                                                 //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

// dot() returns the dot product: v1 dot v2.
inline REAL tetgenmesh::dot(REAL* v1, REAL* v2) 
{
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

// cross() computes the cross product: n = v1 cross v2.
inline void tetgenmesh::cross(REAL* v1, REAL* v2, REAL* n) 
{
  n[0] =   v1[1] * v2[2] - v2[1] * v1[2];
  n[1] = -(v1[0] * v2[2] - v2[0] * v1[2]);
  n[2] =   v1[0] * v2[1] - v2[0] * v1[1];
}

// distance() computes the Euclidean distance between two points.
inline REAL tetgenmesh::distance(REAL* p1, REAL* p2)
{
  return sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) +
              (p2[1] - p1[1]) * (p2[1] - p1[1]) +
              (p2[2] - p1[2]) * (p2[2] - p1[2]));
}

inline REAL tetgenmesh::distance2(REAL* p1, REAL* p2)
{
  return norm2(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
}

inline REAL tetgenmesh::norm2(REAL x, REAL y, REAL z)
{
  return (x) * (x) + (y) * (y) + (z) * (z);
}



#endif // #ifndef tetgenH

