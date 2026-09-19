"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "../../../components/admin-icons";
import { StatusBadge, RowActions } from "../AdminBadges";
import { resolveMediaUrl } from "../../../lib/api";

type Product = {
  id: string;
  code: string;
  name: string;
  image: string;
  status: string;
  updated: string;
};

export default function ProductsList({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Products Management</h1>
          <p>Manage product catalog, translations, and publication status.</p>
        </div>
        <Link className="primary-button admin-new-btn" href="/admin/products/new">
          <PlusIcon /> Add Product
        </Link>
      </div>

      <div className="admin-card admin-products-card">
        <div className="admin-search">
          <SearchIcon />
          <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="admin-table-wrapper flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-product-cell">
                      <div className="admin-product-thumb" style={{ backgroundImage: `url('${resolveMediaUrl(p.image)}')` }} />
                      <div>
                        <div className="admin-table-name">{p.name}</div>
                        <div className="admin-product-code">{p.code}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>{p.updated}</td>
                  <td>
                    <RowActions
                      editHref={`/admin/products/${p.id}`}
                      published={p.status === "Published"}
                      resource="products"
                      id={p.id}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty-row">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          <span>
            Showing 1 to {filtered.length} of {products.length} entries
          </span>
        </div>
      </div>
    </>
  );
}
