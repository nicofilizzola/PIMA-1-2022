/**
 * @note GcalAcl stands for Access Control
 */
export interface GcalAcl {
  kind: 'calendar#aclRule';
  etag: string; // type etag
  id: string;
  scope: {
    type: string;
    value: string;
  };
  role: string;
}
