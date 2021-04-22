"""Add uuid

Revision ID: 75250663f3b2
Revises: ce859ed9d692
Create Date: 2021-04-21 14:36:40.855769

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '75250663f3b2'
down_revision = 'ce859ed9d692'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('uuid', sa.String(length=36), nullable=True))
    op.create_unique_constraint(None, 'users', ['uuid'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'uuid')
    # ### end Alembic commands ###
