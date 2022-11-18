/**
 * @note GcalAcl stands for Access Control
 */
export interface GcalAcl {
  kind: 'calendar#AclRule';
  etag: string; // type etag
  id: string;
  scope: {
    type: string;
    value: string;
  };
  role: string;
}
