CREATE TYPE vector_layer_type_enum AS enum(
  'wfs',
  'upload',
  'places1',
  'places2',
  'actions1',
  'actions2',
  'checks1',
  'checks2',
  'observations1',
  'observations2'
);

CREATE TABLE vector_layers(
  vector_layer_id uuid PRIMARY KEY DEFAULT NULL, -- public.uuid_generate_v7(),
  label text DEFAULT NULL,
  project_id uuid NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
  type vector_layer_type_enum DEFAULT NULL, -- 'wfs',
  display_by_property_value boolean DEFAULT NULL,
  wfs_url text DEFAULT NULL, -- WFS url, for example https://maps.zh.ch/wfs/OGDZHWFS. TODO: rename wfs_url
  wfs_layer jsonb DEFAULT NULL, -- a single option
  wfs_version text DEFAULT NULL, -- often: 1.1.0 or 2.0.0
  wfs_output_format jsonb DEFAULT NULL, --  a single option. TODO: rename wfs_output_format
  feature_count integer DEFAULT NULL,
  point_count integer DEFAULT NULL,
  line_count integer DEFAULT NULL,
  polygon_count integer DEFAULT NULL,
  deleted boolean DEFAULT NULL -- FALSE
);

COMMENT ON TABLE vector_layers IS 'Goal: Bring your own tile layers. Either from wfs or importing GeoJSON. Should only contain metadata, not data fetched from wms or wmts servers (that should only be saved locally on the client).';

COMMENT ON COLUMN vector_layers.feature_count IS 'Number of features. Set when downloaded features';

COMMENT ON COLUMN vector_layers.point_count IS 'Number of point features. Used to show styling for points - or not. Set when downloaded features';

COMMENT ON COLUMN vector_layers.line_count IS 'Number of line features. Used to show styling for lines - or not. Set when downloaded features';

COMMENT ON COLUMN vector_layers.polygon_count IS 'Number of polygon features. Used to show styling for polygons - or not. Set when downloaded features';

ALTER TABLE vector_layers ENABLE electric;

