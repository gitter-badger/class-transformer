import "reflect-metadata";
import {defaultMetadataStorage, classToPlain, classToClass} from "../../src/index";

describe("circular reference problem", () => {

    it("should skip circular reference objects", () => {
        defaultMetadataStorage.clear();

        class Photo {
            id: number;
            filename: string;
            user: User;
            users: User[];
        }

        class User {
            id: number;
            firstName: string;
            photos: Photo[];
        }

        const photo1 = new Photo();
        photo1.id = 1;
        photo1.filename = "me.jpg";

        const photo2 = new Photo();
        photo2.id = 2;
        photo2.filename = "she.jpg";

        const user = new User();
        user.firstName = "Umed Khudoiberdiev";
        user.photos = [photo1, photo2];

        photo1.user = user;
        photo2.user = user;
        photo1.users = [user];
        photo2.users = [user];

        const plainUser = classToPlain(user);
        plainUser.should.be.eql({
            firstName: "Umed Khudoiberdiev",
            photos: [{
                id: 1,
                filename: "me.jpg",
                users: []
            }, {
                id: 2,
                filename: "she.jpg",
                users: []
            }]
        });

    });

    it("should not skip circular reference objects, but handle it correctly in classToClass operation", () => {
        defaultMetadataStorage.clear();

        class Photo {
            id: number;
            filename: string;
            user: User;
            users: User[];
        }

        class User {
            id: number;
            firstName: string;
            photos: Photo[];
        }

        const photo1 = new Photo();
        photo1.id = 1;
        photo1.filename = "me.jpg";

        const photo2 = new Photo();
        photo2.id = 2;
        photo2.filename = "she.jpg";

        const user = new User();
        user.firstName = "Umed Khudoiberdiev";
        user.photos = [photo1, photo2];

        photo1.user = user;
        photo2.user = user;
        photo1.users = [user];
        photo2.users = [user];

        const classUser = classToClass(user);
        classUser.should.not.be.equal(user);
        classUser.should.be.instanceOf(User);
        classUser.should.be.eql(user);

    });

});