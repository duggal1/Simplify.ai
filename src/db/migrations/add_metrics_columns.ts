import { sql } from 'drizzle-orm';

export async function up(db: any) {
  await sql`
    DROP TABLE IF EXISTS conversion_metrics CASCADE;
    
    CREATE TABLE conversion_metrics (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      input_type VARCHAR(50) NOT NULL,
      output_format VARCHAR(50) NOT NULL,
      content_size INTEGER NOT NULL,
      processing_time INTEGER NOT NULL,
      complexity_score VARCHAR(255) NOT NULL DEFAULT '0.00',
      compression_ratio VARCHAR(255) NOT NULL DEFAULT '1.00',
      performance_score VARCHAR(255) NOT NULL DEFAULT '0.00',
      success_rate VARCHAR(255) NOT NULL DEFAULT '100.00',
      error_rate VARCHAR(255) NOT NULL DEFAULT '0.00',
      data_quality_score VARCHAR(255) NOT NULL DEFAULT '0.00',
      output_quality_score VARCHAR(255) NOT NULL DEFAULT '0.00',
      conversion_count INTEGER NOT NULL DEFAULT 0,
      average_processing_time VARCHAR(255) NOT NULL DEFAULT '0.00',
      api_efficiency_score VARCHAR(255) NOT NULL DEFAULT '100.00',
      input_complexity_trend VARCHAR(255) NOT NULL DEFAULT '0.00',
      optimization_level VARCHAR(255) NOT NULL DEFAULT '0.00',
      reliability_score VARCHAR(255) NOT NULL DEFAULT '100.00',
      user_productivity VARCHAR(255) NOT NULL DEFAULT '0.00',
      overall_score VARCHAR(255) NOT NULL DEFAULT '0.00',
      success BOOLEAN NOT NULL DEFAULT true,
      schema_validation BOOLEAN NOT NULL DEFAULT false,
      error_message TEXT,
      last_used TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function down(db: any) {
  await sql`DROP TABLE IF EXISTS conversion_metrics`;
} 