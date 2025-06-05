import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float',{
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text',{
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;


    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    // images
    //un producto puede tener muchas imagenes
    //relacion uno a muchos
    @OneToMany(
        () => ProductImage, // referencia a la entidad ProductImage
        (productImage) => productImage.product, // propiedad de la entidad ProductImage que hace referencia al producto
        { cascade: true, eager: true } // cascade: true permite que las operaciones se propaguen a las imágenes asociadas para poder eliminarlas
    )
    images?: ProductImage[];


    //muchos productos va a tener un usuario
    //en esta tabla se almacenara el new column id del usuario que creo el producto
    @ManyToOne(
        () => User, // referencia a la entidad User
        (user) => user.product, // propiedad de la entidad User que hace referencia a los productos
        { eager: true } // eager: true permite que el usuario asociado se cargue automáticamente al consultar el producto
    )
    user: User;


    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }



}