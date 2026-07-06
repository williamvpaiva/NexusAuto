import crypto from 'crypto';
import { db } from '../config/database';
import type { CreateVehicleInput, UpdateVehicleInput, Vehicle, VehicleFilters } from '../types/vehicle';

export class VehiclesRepository {
  async createTable(): Promise<void> {
    await db.run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        color TEXT NOT NULL,
        price REAL NOT NULL,
        mileage INTEGER NOT NULL,
        fuel_type TEXT NOT NULL CHECK(fuel_type IN ('gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido')),
        transmission TEXT NOT NULL CHECK(transmission IN ('manual', 'automatico', 'cvt')),
        plate TEXT NOT NULL UNIQUE,
        description TEXT,
        images TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async findAll(filters: VehicleFilters = {}, page = 1, perPage = 20, sortBy = 'created_at', sortOrder: 'asc' | 'desc' = 'desc') {
    const offset = (page - 1) * perPage;
    const whereClauses: string[] = [];
    const params: unknown[] = [];

    if (filters.brand) {
      whereClauses.push('LOWER(brand) LIKE ?');
      params.push(`%${filters.brand.toLowerCase()}%`);
    }
    if (filters.model) {
      whereClauses.push('LOWER(model) LIKE ?');
      params.push(`%${filters.model.toLowerCase()}%`);
    }
    if (filters.yearMin) {
      whereClauses.push('year >= ?');
      params.push(filters.yearMin);
    }
    if (filters.yearMax) {
      whereClauses.push('year <= ?');
      params.push(filters.yearMax);
    }
    if (filters.priceMin) {
      whereClauses.push('price >= ?');
      params.push(filters.priceMin);
    }
    if (filters.priceMax) {
      whereClauses.push('price <= ?');
      params.push(filters.priceMax);
    }
    if (filters.fuelType) {
      whereClauses.push('fuel_type = ?');
      params.push(filters.fuelType);
    }
    if (filters.transmission) {
      whereClauses.push('transmission = ?');
      params.push(filters.transmission);
    }
    if (filters.search) {
      whereClauses.push('(LOWER(brand) LIKE ? OR LOWER(model) LIKE ? OR LOWER(description) LIKE ?)');
      const s = `%${filters.search.toLowerCase()}%`;
      params.push(s, s, s);
    }

    const allowedSortColumns = ['created_at', 'price', 'year', 'mileage'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [rows, countResult] = await Promise.all([
      db.all<Record<string, unknown>>(
        `SELECT * FROM vehicles ${whereClause} ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`,
        [...params, perPage, offset]
      ),
      db.get<{ total: number }>(
        `SELECT COUNT(*) as total FROM vehicles ${whereClause}`,
        params
      ),
    ]);

    const total = countResult?.total || 0;

    return {
      data: rows.map(this.mapRow),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async findById(id: string): Promise<Vehicle | undefined> {
    const row = await db.get<Record<string, unknown>>('SELECT * FROM vehicles WHERE id = ?', [id]);
    return row ? this.mapRow(row) : undefined;
  }

  async findByPlate(plate: string): Promise<Vehicle | undefined> {
    const row = await db.get<Record<string, unknown>>('SELECT * FROM vehicles WHERE plate = ?', [plate.toUpperCase()]);
    return row ? this.mapRow(row) : undefined;
  }

  async create(data: CreateVehicleInput): Promise<Vehicle> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const plate = data.plate.toUpperCase();
    const images = data.images ? JSON.stringify(data.images) : null;

    await db.run(
      `INSERT INTO vehicles (id, brand, model, year, color, price, mileage, fuel_type, transmission, plate, description, images, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.brand.trim(), data.model.trim(), data.year, data.color.trim(), data.price, data.mileage, data.fuelType, data.transmission, plate, data.description?.trim() || null, images, now, now]
    );

    return { id, ...data, plate, images: data.images || [], createdAt: now, updatedAt: now };
  }

  async update(id: string, data: UpdateVehicleInput): Promise<Vehicle | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const brand = data.brand?.trim() ?? existing.brand;
    const model = data.model?.trim() ?? existing.model;
    const year = data.year ?? existing.year;
    const color = data.color?.trim() ?? existing.color;
    const price = data.price ?? existing.price;
    const mileage = data.mileage ?? existing.mileage;
    const fuelType = data.fuelType ?? existing.fuelType;
    const transmission = data.transmission ?? existing.transmission;
    const plate = data.plate?.toUpperCase() ?? existing.plate;
    const description = data.description !== undefined ? (data.description?.trim() ?? null) : (existing.description ?? null);
    const images = data.images !== undefined ? JSON.stringify(data.images) : (existing.images ? JSON.stringify(existing.images) : null);

    await db.run(
      `UPDATE vehicles SET brand = ?, model = ?, year = ?, color = ?, price = ?, mileage = ?, fuel_type = ?, transmission = ?, plate = ?, description = ?, images = ?, updated_at = ? WHERE id = ?`,
      [brand, model, year, color, price, mileage, fuelType, transmission, plate, description, images, now, id]
    );

    return { id, brand, model, year, color, price, mileage, fuelType, transmission, plate, description: description || undefined, images: data.images || existing.images || [], createdAt: existing.createdAt, updatedAt: now };
  }

  async delete(id: string): Promise<void> {
    await db.run('DELETE FROM vehicles WHERE id = ?', [id]);
  }

  private mapRow(row: Record<string, unknown>): Vehicle {
    return {
      id: row.id as string,
      brand: row.brand as string,
      model: row.model as string,
      year: row.year as number,
      color: row.color as string,
      price: row.price as number,
      mileage: row.mileage as number,
      fuelType: row.fuel_type as Vehicle['fuelType'],
      transmission: row.transmission as Vehicle['transmission'],
      plate: row.plate as string,
      description: (row.description as string) ?? undefined,
      images: row.images ? JSON.parse(row.images as string) : [],
      createdAt: row.created_at as string,
      updatedAt: (row.updated_at as string) ?? undefined,
    };
  }
}

export const vehiclesRepository = new VehiclesRepository();
