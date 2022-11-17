/**
 * @note GcalAcl stands for Access Control
 */
export interface GcalAcl {
  kind: 'calendar#GcalAclRule';
  etag: string; // type etag
  id: string;
  scope: {
    type: string;
    value: string;
  };
  role: string;
}
