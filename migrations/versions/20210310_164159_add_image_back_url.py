"""Add image_back_url

Revision ID: 328ce1eeb0e1
Revises: 8cb724741a56
Create Date: 2021-03-10 16:41:59.941662

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '328ce1eeb0e1'
down_revision = '8cb724741a56'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('image_back_url', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'image_back_url')
    # ### end Alembic commands ###
