const Evento = require("../models/Evento");

const getEventos = async(req, res) => {
    const eventos = await Evento.find()
                                .populate('user','name')

    res.status(200).json({
        ok: true,
        eventos
    })
}

const createEvento = async(req, res) => {
    const evento = new Evento(req.body)
    try {
        evento.user = req.uid
        const eventoSaved = await evento.save()
        res.status(201).json({
            ok: true,
            evento: eventoSaved
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const updateEvento = async(req, res) => {
    const eventoId = req.params.id
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId)
        if (!evento) {
            return res.status(404).json({
                ok:false,
                msg: 'Evento con ese id no existe'
            })
        }

        // Para verificar que sea el mismo usuario que creo el evento
        if (evento.user.toString() !== uid) {
             return res.status(401).json({
                 ok: false,
                 msg: 'No tiene privilegio para editar este evento'
             })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoUpdated = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

        res.status(201).json({
            ok: true,
            evento: eventoUpdated
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    
}

const deleteEvento = async(req, res) => {
    const eventoId = req.params.id
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId)
        if (!evento) {
            return res.status(404).json({
                ok:false,
                msg: 'Evento con ese id no existe'
            })
        }

        // Para verificar que sea el mismo usuario que creo el evento
        if (evento.user.toString() !== uid) {
             return res.status(401).json({
                 ok: false,
                 msg: 'No tiene privilegio para eliminar este evento'
             })
        }

        await Evento.findByIdAndDelete(eventoId)

        res.status(201).json({
            ok: true,
            msg: 'Evento eliminado satisfactoriamente'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
module.exports = {
    getEventos,
    createEvento,
    updateEvento,
    deleteEvento
}