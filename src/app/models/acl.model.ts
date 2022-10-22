/**
 * @note ACL stands for Access Control
 */
export interface Acl {
  kind: 'calendar#aclRule';
  etag: string; // type etag
  id: string;
  scope: {
    type: string;
    value: string;
  };
  role: string;
}
