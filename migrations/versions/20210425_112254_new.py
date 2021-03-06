"""New

Revision ID: 3f83904fd620
Revises: 
Create Date: 2021-04-25 11:22:54.936018

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3f83904fd620'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('sessions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.String(length=255), nullable=True),
    sa.Column('data', sa.LargeBinary(), nullable=True),
    sa.Column('expiry', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('session_id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uuid', sa.String(length=36), nullable=True),
    sa.Column('profile_addr', sa.String(length=30), nullable=False),
    sa.Column('username', sa.String(length=30), nullable=True),
    sa.Column('first_name', sa.String(length=30), nullable=False),
    sa.Column('last_name', sa.String(length=30), nullable=True),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('email_verified', sa.Boolean(), nullable=True),
    sa.Column('user_role', sa.String(length=16), nullable=False),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.Column('image_back_url', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(length=100), nullable=False),
    sa.Column('confirm_email_sent', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('uuid')
    )
    op.create_table('addresses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('primary_address', sa.Boolean(), nullable=True),
    sa.Column('address', sa.String(length=100), nullable=True),
    sa.Column('lon', sa.Float(), nullable=False),
    sa.Column('lat', sa.Float(), nullable=False),
    sa.Column('state', sa.String(length=12), nullable=True),
    sa.Column('city', sa.String(length=20), nullable=True),
    sa.Column('zip_code', sa.Integer(), nullable=True),
    sa.Column('country', sa.String(length=20), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('chats',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('user1_id', sa.Integer(), nullable=False),
    sa.Column('user2_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user1_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user2_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('chat_id', sa.Integer(), nullable=False),
    sa.Column('sender_id', sa.Integer(), nullable=False),
    sa.Column('body', sa.String(length=2000), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['chat_id'], ['chats.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('products',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('product_type', sa.String(length=30), nullable=True),
    sa.Column('product_icon', sa.String(length=255), nullable=True),
    sa.Column('price', sa.Float(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('description', sa.String(length=2000), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.Column('due_date', sa.DateTime(), nullable=True),
    sa.Column('address_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['address_id'], ['addresses.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.Column('primary', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('liked_products',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('liked_products')
    op.drop_table('images')
    op.drop_table('products')
    op.drop_table('messages')
    op.drop_table('chats')
    op.drop_table('addresses')
    op.drop_table('users')
    op.drop_table('sessions')
    # ### end Alembic commands ###
